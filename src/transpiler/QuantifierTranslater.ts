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
          {
            type: 'PropertyNode',
            predicate: 'Bytes',
            inputs: [`key:signatures:\${${p.inputs[0]}}`]
          },
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
          {
            type: 'PropertyNode',
            predicate: 'Bytes',
            inputs: [
              `range:block\${${p.inputs[3]}}_range\${${p.inputs[1]}}:\${${p.inputs[2]}}`
            ]
          },
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
