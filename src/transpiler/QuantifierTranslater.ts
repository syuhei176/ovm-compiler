import { PropertyDef, PropertyNode } from '../parser/PropertyDef'
import * as utils from './utils'

interface PredicatePreset {
  name: string
  translate: (p: PropertyNode) => PropertyNode
}

interface QuantifierPreset {
  name: string
  translate: (p: PropertyNode) => { hint: string; properties: PropertyNode[] }
}

const presetPredicateTable: { [key: string]: PredicatePreset } = {
  SignedBy: {
    name: 'SignedBy',
    translate: (p: PropertyNode) => {
      return {
        type: 'PropertyNode',
        predicate: 'ThereExistsSuchThat',
        inputs: [
          `signatures,KEY,\${${p.inputs[0]}}`,
          'sig',
          {
            type: 'PropertyNode',
            predicate: 'IsValidSignature',
            inputs: [p.inputs[0], 'sig', p.inputs[1], '$secp256k1']
          }
        ]
      }
    }
  },
  IncludedAt: {
    name: 'IncludedAt',
    translate: (p: PropertyNode) => {
      return {
        type: 'PropertyNode',
        predicate: 'ThereExistsSuchThat',
        inputs: [
          `su.block\${${p.inputs[3]}}.range\${${p.inputs[1]}},RANGE,\${${p.inputs[2]}}`,
          'inclusionProof',
          {
            type: 'PropertyNode',
            predicate: 'VerifyInclusion',
            inputs: [
              p.inputs[0],
              p.inputs[1],
              p.inputs[2],
              'inclusionProof',
              p.inputs[3]
            ]
          }
        ]
      }
    }
  }
}
const zero =
  '0x0000000000000000000000000000000000000000000000000000000000000000'
const presetQuantifierTable: { [key: string]: QuantifierPreset } = {
  IsLessThan: {
    name: 'IsLessThan',
    translate: (p: PropertyNode) => {
      const quantifier = p.inputs[0] as PropertyNode
      const variable = p.inputs[1]
      return {
        hint: `range,NUMBER,${zero}-\${${quantifier.inputs[0]}}`,
        properties: [
          {
            type: 'PropertyNode',
            predicate: 'IsLessThan',
            inputs: [variable, quantifier.inputs[0]]
          }
        ]
      }
    }
  },
  Range: {
    name: 'Range',
    translate: (p: PropertyNode) => {
      const quantifier = p.inputs[0] as PropertyNode
      const variable = p.inputs[1]
      return {
        hint: `range,NUMBER,\${${quantifier.inputs[0]}}\${${quantifier.inputs[1]}}`,
        properties: [
          {
            type: 'PropertyNode',
            predicate: 'IsLessThan',
            inputs: [quantifier.inputs[0], variable]
          },
          {
            type: 'PropertyNode',
            predicate: 'IsLessThan',
            inputs: [variable, quantifier.inputs[1]]
          }
        ]
      }
    }
  },
  SU: {
    name: 'SU',
    translate: (p: PropertyNode) => {
      const quantifier = p.inputs[0] as PropertyNode
      const variable = p.inputs[1]
      if (quantifier.inputs.length == 2) {
        return {
          hint: `su.block\${${quantifier.inputs[0]}}.range\${${quantifier.inputs[1]}},ITER,${zero}`,
          properties: []
        }
      } else if (quantifier.inputs.length == 3) {
        return {
          hint: `su.block\${${quantifier.inputs[0]}}.range\${${quantifier.inputs[1]}},RANGE,\${${quantifier.inputs[2]}}`,
          properties: [
            {
              type: 'PropertyNode',
              predicate: 'IncludedWithin',
              inputs: [
                variable,
                quantifier.inputs[1],
                quantifier.inputs[2],
                quantifier.inputs[0]
              ]
            }
          ]
        }
      } else {
        throw new Error('invalid number of quantifier inputs')
      }
    }
  },
  Tx: {
    name: 'Tx',
    translate: (p: PropertyNode) => {
      const quantifier = p.inputs[0] as PropertyNode
      const variable = p.inputs[1]
      return {
        hint: `tx.block\${${quantifier.inputs[2]}}.range\${${quantifier.inputs[0]}},RANGE,\${${quantifier.inputs[1]}}`,
        properties: [
          {
            type: 'PropertyNode',
            predicate: 'Equal',
            inputs: [variable + '.address', '$TransactionAddress']
          },
          {
            type: 'PropertyNode',
            predicate: 'Equal',
            inputs: [variable + '.0', quantifier.inputs[0]]
          },
          {
            type: 'PropertyNode',
            predicate: 'IsContained',
            inputs: [variable + '.1', quantifier.inputs[1]]
          },
          {
            type: 'PropertyNode',
            predicate: 'Equal',
            inputs: [variable + '.2', quantifier.inputs[2]]
          }
        ]
      }
    }
  }
}

export function translateQuantifier(
  propertyDefs: PropertyDef[]
): PropertyDef[] {
  return propertyDefs.map(translateQuantifierPerPropertyDef)
}

function translateQuantifierPerPropertyDef(p: PropertyDef): PropertyDef {
  p.body = translateQuantifierPerPropertyNode(p.body)
  return p
}

function translateQuantifierPerPropertyNode(p: PropertyNode): PropertyNode {
  if (utils.isAtomicProposition(p.predicate)) {
    const preset = presetPredicateTable[p.predicate]
    if (preset) {
      return preset.translate(p)
    }
  } else if (p.predicate == 'ForAllSuchThat') {
    return translateForAllSuchThat(p)
  } else if (p.predicate == 'ThereExistsSuchThat') {
    return translateThereExistsSuchThat(p)
  } else {
    p.inputs = p.inputs.map((i: string | undefined | PropertyNode) => {
      if (typeof i === 'string' || i === undefined) {
        return i
      } else {
        return translateQuantifierPerPropertyNode(i)
      }
    })
  }
  return p
}

function translateForAllSuchThat(p: PropertyNode): PropertyNode {
  if (p.inputs[0] === undefined || typeof p.inputs[0] === 'string') {
    throw new Error('invalid quantifier')
  }
  const preset = presetQuantifierTable[p.inputs[0].predicate]
  p.inputs[2] = translateQuantifierPerPropertyNode(p.inputs[2] as PropertyNode)
  if (preset) {
    const translated = preset.translate(p)
    p.inputs[0] = translated.hint
    const condition = translated.properties[0]
    if (condition) {
      p.inputs[2] = {
        type: 'PropertyNode',
        predicate: 'Or',
        inputs: [
          {
            type: 'PropertyNode',
            predicate: 'Not',
            inputs: [condition]
          },
          p.inputs[2]
        ]
      }
    }
  }
  return p
}

function translateThereExistsSuchThat(p: PropertyNode): PropertyNode {
  if (p.inputs[0] === undefined || typeof p.inputs[0] === 'string') {
    throw new Error('invalid quantifier')
  }
  const preset = presetQuantifierTable[p.inputs[0].predicate]
  p.inputs[2] = translateQuantifierPerPropertyNode(p.inputs[2] as PropertyNode)
  if (preset) {
    const translated = preset.translate(p)
    p.inputs[0] = translated.hint
    if (translated.properties.length > 0) {
      p.inputs[2] = {
        type: 'PropertyNode',
        predicate: 'And',
        inputs: translated.properties.concat([p.inputs[2]])
      }
    }
  }
  return p
}
