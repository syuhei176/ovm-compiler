import { createCompiledPredicates } from './ContractCompiler'
import { translateQuantifier } from './QuantifierTranslater'
import { CompiledPredicate } from './CompiledPredicate'
import { PropertyDef } from '../parser/PropertyDef'

export function transpilePropertyDefsToCompiledPredicate(
  propertyDefs: PropertyDef[]
): CompiledPredicate[] {
  return createCompiledPredicates(translateQuantifier(propertyDefs))
}
