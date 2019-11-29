/**
 * Parsed Property definition
 */
export interface PropertyDef {
  name: string
  inputDefs: string[]
  body: PropertyNode | null
}

export interface PropertyNode {
  type: 'PropertyNode'
  predicate: string
  inputs: Input[]
  isCompiled?: boolean
}

type Input = string | PropertyNode | undefined

/**
 * Compiled Property definition
 */
export interface IntermediateCompiledPredicate {
  type: 'IntermediateCompiledPredicate'
  isCompiled: boolean
  originalPredicateName: string
  definition: IntermediateCompiledPredicateDef
  //  inputs: number[]
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

export interface CompiledPredicate {
  type: 'CompiledPredicate'
  name: string
  inputDefs: string[]
  contracts: IntermediateCompiledPredicate[]
}
