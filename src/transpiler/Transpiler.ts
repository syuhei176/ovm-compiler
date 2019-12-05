import * as utils from './utils'
import {
  CompiledInput,
  CompiledPredicate,
  IntermediateCompiledPredicate,
  AtomicProposition,
  Predicate
} from './CompiledPredicate'

import { PropertyDef, PropertyNode } from '../parser/PropertyDef'

/**
 *
 * @param {*} claimDefinitions are definition of claim
 * ```
 * def ownership(owner) :=
 * with Tx(su) as tx {
 *   with Signature() as signature {
 *     SignedBy(tx, owner, signature)
 *   }
 * }
 * ```
 * ```
 * {
 *   "dec": {
 *     "predicate": predicate name,
 *     "inputDefs": ["argument name"...]
 *   },
 *   "statement": [
 *     "predicate":
 *     "inputDefs": [property or constant...]
 *   ]
 * }
 * ```
 */
export function calculateInteractiveNodes(
  claimDefinitions: PropertyDef[]
): CompiledPredicate[] {
  return claimDefinitions.map(calculateInteractiveNodesPerProperty)
}

function calculateInteractiveNodesPerProperty(
  p: PropertyDef
): CompiledPredicate {
  const name = utils.toCapitalCase(p.name)
  let newContracts: IntermediateCompiledPredicate[] = []
  if (p.body == null) {
    throw new Error('p.body must not be null')
  }
  searchInteractiveNode(
    newContracts,
    p.body,
    {
      type: 'IntermediateCompiledPredicate',
      isCompiled: true,
      originalPredicateName: '',
      definition: {
        type: 'IntermediateCompiledPredicateDef',
        name: '',
        predicate: '',
        inputDefs: p.inputDefs,
        inputs: []
      }
    },
    name,
    ''
  )
  return {
    type: 'CompiledPredicate',
    name,
    inputDefs: p.inputDefs,
    contracts: newContracts
  }
}

/**
 * searchInteractiveNode
 * @param {*} contracts
 * @param {*} property
 * @param {*} parent
 * @param {*} name
 * @param {*} parentSuffix
 */
function searchInteractiveNode(
  contracts: IntermediateCompiledPredicate[],
  property: PropertyNode,
  parent: IntermediateCompiledPredicate,
  name?: string,
  parentSuffix?: string
): AtomicProposition {
  if (
    utils.isNotAtomicProposition(property.predicate) &&
    name !== undefined &&
    parentSuffix !== undefined
  ) {
    let suffix = parentSuffix + property.predicate[0]
    const newInputDefs = [makeContractName(name, suffix)].concat(
      getArguments(property)
    )
    const newContract: IntermediateCompiledPredicate = {
      type: 'IntermediateCompiledPredicate',
      isCompiled: true,
      originalPredicateName: name,
      definition: {
        type: 'IntermediateCompiledPredicateDef',
        name: makeContractName(name, suffix),
        predicate: property.predicate,
        inputDefs: newInputDefs,
        inputs: []
      }
      //      inputs: getInputIndex(parent.definition.inputDefs, newInputDefs)
    }
    let children = []
    if (
      property.predicate == 'ForAllSuchThat' ||
      property.predicate == 'ThereExistsSuchThat'
    ) {
      if (
        typeof property.inputs[0] == 'string' ||
        property.inputs[0] == undefined
      ) {
        throw new Error('property.inputs[0] must not be string')
      }
      if (
        typeof property.inputs[2] == 'string' ||
        property.inputs[2] == undefined
      ) {
        throw new Error('property.inputs[2] must not be string')
      }
      if (property.inputs[0].type != 'PropertyNode') {
        throw new Error('property.inputs[0] must not be PropertyNode')
      }
      if (property.inputs[2].type != 'PropertyNode') {
        throw new Error('property.inputs[2] must not be PropertyNode')
      }
      // quantifier
      children[0] = searchInteractiveNode(
        contracts,
        property.inputs[0],
        newContract
      )
      // innerProperty
      children[1] = searchInteractiveNode(
        contracts,
        property.inputs[2],
        newContract,
        name,
        suffix
      )
    } else if (
      property.predicate == 'And' ||
      property.predicate == 'Or' ||
      property.predicate == 'Not'
    ) {
      property.inputs.forEach(
        (
          p: PropertyNode | IntermediateCompiledPredicate | string | undefined,
          i: number
        ) => {
          if (typeof p == 'string' || p == undefined) {
            throw new Error(`property.inputs[${i}] must not be string`)
          }
          if (p.type != 'PropertyNode') {
            throw new Error(`property.inputs[${i}] must not be PropertyNode`)
          }
          children[i] = searchInteractiveNode(
            contracts,
            p,
            newContract,
            name,
            suffix + (i + 1)
          )
        }
      )
    }
    newContract.definition.inputs = children
    // If not atomic proposition, generate a contract
    contracts.push(newContract)
    return {
      type: 'AtomicProposition',
      predicate: {
        type: 'AtomicPredicate',
        source: newContract.definition.name
      },
      inputs: getInputIndex(parent.definition.inputDefs, newInputDefs)
    }
  } else {
    return {
      type: 'AtomicProposition',
      predicate: getPredicate(parent.definition.inputDefs, property.predicate),
      inputs: getInputIndex(
        parent.definition.inputDefs,
        property.inputs as string[]
      )
    }
  }
}

function getPredicate(inputDefs: string[], name: string): Predicate {
  const inputIndex = inputDefs.indexOf(name)
  if (inputIndex >= 0) {
    return {
      type: 'InputPredicate',
      source: {
        type: 'NormalInput',
        inputIndex: inputIndex,
        children: []
      }
    }
  } else if (utils.isUpperCase(name[0])) {
    return {
      type: 'AtomicPredicate',
      source: name
    }
  } else {
    return {
      type: 'VariablePredicate'
    }
  }
}

function getInputIndex(inputDefs: string[], inputs: string[]): CompiledInput[] {
  return inputs.map(name => {
    if (name.indexOf('.') > 0) {
      // in case of that name is bind operator
      const nameArr = name.split('.')
      const parent = nameArr[0]
      const child = nameArr[1]
      const inputIndex = inputDefs.indexOf(parent)
      if (inputIndex >= 0) {
        return {
          type: 'NormalInput',
          inputIndex: inputDefs.indexOf(parent),
          children: [Number(child)]
        }
      } else {
        return {
          type: 'VariableInput',
          placeholder: parent,
          children: [Number(child)]
        }
      }
    } else {
      const inputIndex = inputDefs.indexOf(name)
      if (inputIndex >= 0) {
        return {
          type: 'NormalInput',
          inputIndex: inputDefs.indexOf(name),
          children: []
        }
      }
    }
    return {
      type: 'VariableInput',
      placeholder: name,
      children: []
    }
  })
}

function getArguments(property: PropertyNode): any[] {
  let args: any[] = []
  if (
    property.predicate == 'ForAllSuchThat' ||
    property.predicate == 'ThereExistsSuchThat'
  ) {
    args = args.concat(getArguments(property.inputs[0] as PropertyNode))
    const variable = property.inputs[1] as string
    const innerArgs = getArguments(property.inputs[2] as PropertyNode)
    args = args.concat(innerArgs.filter(a => a != variable))
  } else {
    if (!utils.isUpperCase(property.predicate[0])) {
      args.push(property.predicate)
    }
    property.inputs.forEach((p: PropertyNode | string | undefined) => {
      if (p !== undefined) {
        if (typeof p === 'string') {
          // bind operator
          if (p.indexOf('.') > 0) {
            args.push(p.substr(0, p.indexOf('.')))
          } else {
            args.push(p)
          }
        } else if (p.type == 'PropertyNode') {
          args = args.concat(getArguments(p))
        }
      }
    })
  }
  return args.filter(function(x, i, self) {
    return self.indexOf(x) === i
  })
}

function makeContractName(name: string, suffix: string) {
  return utils.toCapitalCase(name) + suffix
}
