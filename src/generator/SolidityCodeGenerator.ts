import ejs from 'ejs'
import templateSource from './sol'
import { CodeGenerator } from './CodeGenerator'
import { CompiledPredicate } from '../transpiler'

export class SolidityCodeGenerator implements CodeGenerator {
  generate(compiledPredicates: CompiledPredicate[]) {
    const template = ejs.compile(templateSource.toString(), {})
    const output = template({
      compiledPredicates
    })
    return output
  }
}
