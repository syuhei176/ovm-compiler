import { createCompiledPredicates } from './ContractCompiler'
import { translateQuantifier } from './QuantifierTranslater'
import { CompiledPredicate } from './CompiledPredicate'
import { Program } from '@cryptoeconomicslab/ovm-parser/lib/PropertyDef'

export function transpile(program: Program): CompiledPredicate[] {
  return createCompiledPredicates(translateQuantifier(program.declarations))
}
