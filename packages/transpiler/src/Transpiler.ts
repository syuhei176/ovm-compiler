import { createCompiledPredicates } from './ContractCompiler'
import { applyLibraries } from './QuantifierTranslater'
import { CompiledPredicate } from './CompiledPredicate'
import {
  Import,
  Program,
  PropertyDef
} from '@cryptoeconomicslab/ovm-parser/lib/PropertyDef'
import { isLibrary } from './utils'

export type ImportHandler = (_import: Import) => Program

/**
 * transpile a Program to CompiledPredicate
 * @param program Original program
 * @param importHandler A handler to load module
 */
export function transpile(
  program: Program,
  importHandler: ImportHandler
): CompiledPredicate[] {
  const importPredicates = createImportPredicates(importHandler)
  // Compile predicates which isn't library
  return createCompiledPredicates(
    applyLibraries(program.declarations, importPredicates(program)).filter(
      p => !isLibrary(p)
    )
  )
}

/**
 * create an import predicates function
 * @param importHandler
 */
function createImportPredicates(importHandler: ImportHandler) {
  const importPredicates = (program: Program): PropertyDef[] =>
    program.imports.reduce<PropertyDef[]>((declarations, i) => {
      const p = importHandler(i)
      return declarations.concat(
        applyLibraries(p.declarations, importPredicates(p))
      )
    }, [])
  return importPredicates
}
