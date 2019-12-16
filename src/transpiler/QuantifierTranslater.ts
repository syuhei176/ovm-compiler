import { PropertyDef, PropertyNode } from '../parser/PropertyDef'
import * as utils from './utils'

interface Preset {
  name: string
  translate: (p: PropertyNode) => PropertyNode
}

const presetQuantifierTable: { [key: string]: Preset } = {
  SignedBy: {
    name: 'SignedBy',
    translate: (p: PropertyNode) => {
      return {
        type: 'PropertyNode',
        predicate: 'ThereExistsSuchThat',
        inputs: [
          `key:signatures:\${${p.inputs[0]}}`,
          'sig',
          {
            type: 'PropertyNode',
            predicate: 'IsValidSignature',
            inputs: [p.inputs[0], p.inputs[1], 'sig']
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
          `range:block\${${p.inputs[3]}}_range\${${p.inputs[1]}}:\${${p.inputs[2]}}`,
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
const presetUniversalQuantifierTable: { [key: string]: Preset } = {
  LessThan: {
    name: 'LessThan',
    translate: (p: PropertyNode) => {
      const quantifier = p.inputs[0] as PropertyNode
      const variable = p.inputs[1]
      return {
        type: 'PropertyNode',
        predicate: 'ForAllSuchThat',
        inputs: [
          `lessthan::\${${quantifier.inputs[0]}}`,
          p.inputs[1],
          {
            type: 'PropertyNode',
            predicate: 'Or',
            inputs: [
              {
                type: 'PropertyNode',
                predicate: 'Not',
                inputs: [
                  {
                    type: 'PropertyNode',
                    predicate: 'LessThan',
                    inputs: [variable, quantifier.inputs[0]]
                  }
                ]
              },
              p.inputs[2] as PropertyNode
            ]
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
      return {
        type: 'PropertyNode',
        predicate: 'ForAllSuchThat',
        inputs: [
          `range:block\${${quantifier.inputs[0]}}_range\${${quantifier.inputs[1]}}:\${${quantifier.inputs[2]}}`,
          p.inputs[1],
          {
            type: 'PropertyNode',
            predicate: 'Or',
            inputs: [
              {
                type: 'PropertyNode',
                predicate: 'Not',
                inputs: [
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
              },
              p.inputs[2] as PropertyNode
            ]
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
    const preset = presetQuantifierTable[p.predicate]
    if (preset) {
      return preset.translate(p)
    }
  } else if (
    p.predicate == 'ForAllSuchThat' &&
    p.inputs[0] !== undefined &&
    typeof p.inputs[0] !== 'string'
  ) {
    const preset = presetUniversalQuantifierTable[p.inputs[0].predicate]
    if (preset) {
      p.inputs[2] = translateQuantifierPerPropertyNode(
        p.inputs[2] as PropertyNode
      )
      return preset.translate(p)
    }
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
