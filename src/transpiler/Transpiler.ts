import * as utils from './utils'
import {
  CompiledPredicate,
  IntermediateCompiledPredicate,
  PropertyDef,
  PropertyNode
} from './PropertyDef'

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
      inputs: [],
      definition: p
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
): PropertyNode {
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
        name: makeContractName(name, suffix),
        inputDefs: newInputDefs,
        body: {
          type: 'PropertyNode',
          predicate: property.predicate,
          inputs: []
        }
      },
      inputs: getInputIndex(parent.definition.inputDefs, newInputDefs)
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
      children[2] = searchInteractiveNode(
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
    if (newContract.definition.body) {
      newContract.definition.body.inputs = children
    } else {
      throw new Error('newContract.definition.body must not be null')
    }
    // If not atomic proposition, generate a contract
    contracts.push(newContract)
    return {
      type: 'PropertyNode',
      predicate: newContract.definition.name,
      inputs: newContract.definition.inputDefs,
      isCompiled: true
    }
  } else {
    const processedProperty = property //processBindOperator(property)
    return property
    /*
    return {
      type: 'PropertyNode',
      predicate: '',
      isCompiled: false,
      originalPredicateName: processedProperty.predicate,
      definition: {
        name: processedProperty.predicate,
        inputDefs: processedProperty.inputs as string[],
        body: null
      },
      inputs: getInputIndex(
        parent.definition.inputDefs,
        processedProperty.inputs as string[]
      )
    }
    */
  }
}

/*
function processBindOperator(property: PropertyNode): PropertyNode {
  if (
    utils.isComparisonPredicate(property.predicate) &&
    property.inputDefs[0].syntax == 'bind'
  ) {
    return {
      predicate: property.predicate,
      inputDefs: [
        property.inputDefs[0].parent,
        // TODO: constant value
        property.inputDefs[0].child,
        property.inputDefs[1]
      ]
    }
  } else {
    return property
  }
}
*/

function getInputIndex(inputDefs: any, inputs: string[]) {
  return inputs.map(name => {
    return inputDefs.indexOf(name)
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
    property.inputs.forEach(
      (
        p: PropertyNode | IntermediateCompiledPredicate | string | undefined
      ) => {
        if (
          typeof p != 'string' &&
          p !== undefined &&
          p.type == 'PropertyNode'
        ) {
          args = args.concat(getArguments(p))
        } else {
          /*
        if (p.syntax == 'bind') {
          args.push(p.parent)
        } else {
          args.push(p)
        }
        */
          args.push(p)
        }
      }
    )
  }
  return args.filter(function(x, i, self) {
    return self.indexOf(x) === i
  })
}

function makeContractName(name: string, suffix: string) {
  return utils.toCapitalCase(name) + suffix
}
