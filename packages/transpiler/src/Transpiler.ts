import { createCompiledPredicates } from './ContractCompiler'
import { applyLibraries } from './QuantifierTranslater'
import { CompiledPredicate } from './CompiledPredicate'
import {
  Import,
  Program,
  PropertyDef
} from '@cryptoeconomicslab/ovm-parser/lib/PropertyDef'

export type ImportHandler = (_import: Import) => Program

export function transpile(
  program: Program,
  handler: ImportHandler
): CompiledPredicate[] {
  const importPredicates = createImportPredicates(handler)
  return createCompiledPredicates(
    applyLibraries(program.declarations, importPredicates(program))
  )
}

function createImportPredicates(handler: ImportHandler) {
  const importPredicates = (program: Program): PropertyDef[] =>
    program.imports.reduce<PropertyDef[]>((decs, i) => {
      const p = handler(i)
      return decs.concat(p.declarations).concat(importPredicates(p))
    }, [])
  return importPredicates
}
