import { PropertyDef, PropertyNode } from '@cryptoeconomicslab/ovm-parser'
import * as utils from './utils'

interface PredicatePreset {
  name: string
  translate: (p: PropertyNode) => PropertyNode
}

interface QuantifierPreset {
  name: string
  translate: (
    quantifier: PropertyNode,
    variable: string
  ) => { hint: string; property: PropertyNode }
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
  },
  IsWithinRange: {
    name: 'IsWithinRange',
    translate: (p: PropertyNode) => {
      return {
        type: 'PropertyNode',
        predicate: 'And',
        inputs: [
          {
            type: 'PropertyNode',
            predicate: 'IsLessThan',
            inputs: [p.inputs[1], p.inputs[0]]
          },
          {
            type: 'PropertyNode',
            predicate: 'IsLessThan',
            inputs: [p.inputs[0], p.inputs[2]]
          }
        ]
      }
    }
  },
  IncludedWithin: {
    name: 'IncludedWithin',
    translate: (p: PropertyNode) => {
      const inputs: PropertyNode[] = [
        {
          type: 'PropertyNode',
          predicate: 'ThereExistsSuchThat',
          inputs: [
            `su.block\${${p.inputs[1]}}.range\${${p.inputs[2]}},RANGE,\${${p.inputs[3]}}`,
            'proof',
            {
              type: 'PropertyNode',
              predicate: 'VerifyInclusion',
              inputs: [
                p.inputs[0],
                p.inputs[0] + '.0',
                p.inputs[0] + '.1',
                'proof',
                p.inputs[1]
              ]
            }
          ]
        },
        {
          type: 'PropertyNode',
          predicate: 'Equal',
          inputs: [p.inputs[0] + '.0', p.inputs[2]]
        }
      ]
      if (p.inputs.length > 3) {
        inputs.push({
          type: 'PropertyNode',
          predicate: 'IsContained',
          inputs: [p.inputs[0] + '.1', p.inputs[3]]
        })
      }
      return {
        type: 'PropertyNode',
        predicate: 'And',
        inputs: inputs
      }
    }
  },
  IsTx: {
    name: 'IsTx',
    translate: (p: PropertyNode) => {
      return {
        type: 'PropertyNode',
        predicate: 'And',
        inputs: [
          {
            type: 'PropertyNode',
            predicate: 'Equal',
            inputs: [p.inputs[0] + '.address', '$TransactionAddress']
          },
          {
            type: 'PropertyNode',
            predicate: 'Equal',
            inputs: [p.inputs[0] + '.0', p.inputs[1]]
          },
          {
            type: 'PropertyNode',
            predicate: 'IsContained',
            inputs: [p.inputs[0] + '.1', p.inputs[2]]
          },
          {
            type: 'PropertyNode',
            predicate: 'Equal',
            inputs: [p.inputs[0] + '.2', p.inputs[3]]
          }
        ]
      }
    }
  }
}

const createQuantifier = (
  name: string,
  predicate: string,
  hint: (quantifier: PropertyNode) => string
): QuantifierPreset => {
  return {
    name,
    translate: (quantifier: PropertyNode, variable: string) => {
      return {
        hint: hint(quantifier),
        property: {
          type: 'PropertyNode',
          predicate,
          inputs: [variable].concat(quantifier.inputs as string[])
        }
      }
    }
  }
}

const zero = '0000000000000000000000000000000000000000000000000000000000000000'
const presetQuantifierTable: { [key: string]: QuantifierPreset } = {
  IsLessThan: createQuantifier(
    'IsLessThan',
    'IsLessThan',
    (quantifier: PropertyNode) =>
      `range,NUMBER,${zero}\${${quantifier.inputs[0]}}`
  ),
  Range: createQuantifier(
    'Range',
    'IsWithinRange',
    (quantifier: PropertyNode) =>
      `range,NUMBER,\${${quantifier.inputs[0]}}\${${quantifier.inputs[1]}}`
  ),
  SU: createQuantifier('SU', 'IncludedWithin', (quantifier: PropertyNode) => {
    if (quantifier.inputs.length == 2) {
      return `su.block\${${quantifier.inputs[0]}}.range\${${quantifier.inputs[1]}},ITER,${zero}`
    } else if (quantifier.inputs.length == 3) {
      return `su.block\${${quantifier.inputs[0]}}.range\${${quantifier.inputs[1]}},RANGE,\${${quantifier.inputs[2]}}`
    } else {
      throw new Error('invalid number of quantifier inputs')
    }
  }),
  Tx: createQuantifier(
    'Tx',
    'IsTx',
    (quantifier: PropertyNode) =>
      `tx.block\${${quantifier.inputs[2]}}.range\${${quantifier.inputs[0]}},RANGE,\${${quantifier.inputs[1]}}`
  )
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
    const quantifier = p.inputs[0] as PropertyNode
    const variable = p.inputs[1] as string
    const translated = preset.translate(quantifier, variable)
    p.inputs[0] = translated.hint
    const condition = translated.property
    if (condition) {
      p.inputs[2] = {
        type: 'PropertyNode',
        predicate: 'Or',
        inputs: [
          {
            type: 'PropertyNode',
            predicate: 'Not',
            inputs: [translateQuantifierPerPropertyNode(condition)]
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
    const quantifier = p.inputs[0] as PropertyNode
    const variable = p.inputs[1] as string
    const translated = preset.translate(quantifier, variable)
    p.inputs[0] = translated.hint
    if (translated.property) {
      p.inputs[2] = {
        type: 'PropertyNode',
        predicate: 'And',
        inputs: [
          translateQuantifierPerPropertyNode(translated.property),
          p.inputs[2]
        ]
      }
    }
  }
  return p
}
