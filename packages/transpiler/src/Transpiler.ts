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
    applyLibraries(program.declarations, importPredicates(program)).filter(
      p => p.annotations.find(a => a.body.name == 'inline') === undefined
    )
  )
}

function createImportPredicates(handler: ImportHandler) {
  const importPredicates = (program: Program): PropertyDef[] =>
    program.imports.reduce<PropertyDef[]>((declarations, i) => {
      const p = handler(i)
      return declarations.concat(
        applyLibraries(p.declarations, importPredicates(p))
      )
    }, [])
  return importPredicates
}
