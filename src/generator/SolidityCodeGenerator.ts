import ejs from 'ejs'
import templateSource from './sol'
import decide from './decide'
import getChild from './getChild'
import constructProperty from './constructProperty'
import constructInputs from './constructInputs'
import decideProperty from './decideProperty'
import { CodeGenerator } from './CodeGenerator'
import { CompiledPredicate, AtomicProposition } from '../transpiler'

const templates: { [key: string]: string } = {
  decide: decide.toString(),
  getChild: getChild.toString(),
  constrcutProperty: constructProperty.toString(),
  constructInputs: constructInputs.toString(),
  decideProperty: decideProperty.toString()
}
const helpers = {
  getInputs,
  getEncodedProperty,
  isValidChallenge
}

const includeCallback = (filename: string, d: any) => {
  const template = ejs.compile(templates[filename], {
    client: true
  })
  return template({ ...helpers, ...d }, undefined, includeCallback)
}

export class SolidityCodeGenerator implements CodeGenerator {
  generate(compiledPredicates: CompiledPredicate[]) {
    const template = ejs.compile(templateSource.toString(), { client: true })
    const output = template(
      {
        compiledPredicates,
        ...helpers
      },
      undefined,
      includeCallback
    )
    return output
  }
}

function getInputs(
  item: AtomicProposition,
  witnessName?: string,
  doesWitnessExist?: boolean
) {
  let str = ''
  /*
  if (item.type == 'IntermediateCompiledPredicate') {
    str += item.definition.name + ', '
  }
  */
  for (var k = 0; k < item.inputs.length; k++) {
    const input = item.inputs[k]
    if (input.type == 'NormalInput') {
      str += '_inputs[' + input.inputIndex + ']'
    } else {
      str += witnessName || 'challengeInput'
    }
    if (k < item.inputs.length - 1) {
      str += ','
    }
  }
  if (doesWitnessExist) {
    if (str.length == 0) {
      str += witnessName
    } else {
      str += ', ' + witnessName
    }
  }
  return str
}
function isValidChallenge(predicate: string) {
  return (
    predicate == 'ForAllSuchThat' || predicate == 'Not' || predicate == 'And'
  )
}

function getEncodedProperty(innerProperty: AtomicProposition) {
  if (innerProperty.predicate.type == 'InputPredicate') {
    return '_inputs[' + innerProperty.predicate.source.inputIndex + ']'
  } else if (innerProperty.predicate.type == 'VariablePredicate') {
    return 'challengeInput'
  } else {
    return (
      'abi.encode(type.Property({' +
      'predicateAddress: ' +
      (innerProperty.isCompiled
        ? 'address(this)'
        : innerProperty.predicate.source) +
      ',' +
      'inputs: [' +
      getInputs(innerProperty) +
      ']' +
      '}))'
    )
  }
}
