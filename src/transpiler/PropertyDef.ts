/**
 * Property definition
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

export interface IntermediateCompiledPredicate {
  type: 'IntermediateCompiledPredicate'
  isCompiled: boolean
  originalPredicateName: string
  definition: PropertyDef
  inputs: number[]
}

type Input = string | PropertyNode | undefined

export interface CompiledPredicate {
  type: 'CompiledPredicate'
  name: string
  inputDefs: string[]
  contracts: IntermediateCompiledPredicate[]
}
