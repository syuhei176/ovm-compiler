/**
 * Compiled Property definition
 */
export interface CompiledPredicate {
  type: 'CompiledPredicate'
  name: string
  inputDefs: string[]
  contracts: IntermediateCompiledPredicate[]
}

export interface IntermediateCompiledPredicate {
  type: 'IntermediateCompiledPredicate'
  isCompiled: boolean
  originalPredicateName: string
  definition: IntermediateCompiledPredicateDef
}

export interface IntermediateCompiledPredicateDef {
  type: 'IntermediateCompiledPredicateDef'
  name: string
  predicate: string
  inputDefs: string[]
  inputs: AtomicProposition[]
}

export interface AtomicProposition {
  type: 'AtomicProposition'
  predicate: string
  inputs: CompiledInput[]
}

export type CompiledInput = number | number[]
