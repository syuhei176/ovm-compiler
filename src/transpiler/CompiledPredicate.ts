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
  // logical connective
  predicate: string
  inputDefs: string[]
  inputs: AtomicProposition[]
}

export interface AtomicProposition {
  type: 'AtomicProposition'
  predicate: Predicate
  inputs: CompiledInput[]
}

export type Predicate = AtomicPredicate | InputPredicate | VariablePredicate

export interface AtomicPredicate {
  type: 'AtomicPredicate'
  source: string
}

export interface InputPredicate {
  type: 'InputPredicate'
  source: NormalInput
}

export interface VariablePredicate {
  type: 'VariablePredicate'
}

/**
 * challengeInput -1
 * inputs[0] is 0
 * inputs[0].inputs[0] is [0, 0]
 */
export type CompiledInput = LabelInput | NormalInput | VariableInput

export interface LabelInput {
  type: 'LabelInput'
  label: string
}

export interface NormalInput {
  type: 'NormalInput'
  inputIndex: number
  children: number[]
}

export interface VariableInput {
  type: 'VariableInput'
  placeholder: string
  children: number[]
}
