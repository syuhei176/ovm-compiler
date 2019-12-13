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
  constructProperty: constructProperty.toString(),
  constructInputs: constructInputs.toString(),
  decideProperty: decideProperty.toString()
}
const helpers = {}

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
