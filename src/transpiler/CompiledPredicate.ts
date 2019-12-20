/**
 * Compiled Property definition
 */
export interface CompiledPredicate {
  type: 'CompiledPredicate'
  name: string
  inputDefs: string[]
  contracts: IntermediateCompiledPredicate[]
  constants?: ConstantVariable[]
  entryPoint: string
}

export interface ConstantVariable {
  varType: 'address' | 'bytes'
  name: string
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
  connective: LogicalConnective
  inputDefs: string[]
  inputs: (AtomicProposition | Placeholder)[]
  propertyInputs: NormalInput[]
}

export interface AtomicProposition {
  type: 'AtomicProposition'
  predicate: PredicateCall
  inputs: CompiledInput[]
  isCompiled?: boolean
}

export type Placeholder = string

export type PredicateCall =
  | AtomicPredicateCall
  | InputPredicateCall
  | VariablePredicateCall

export interface AtomicPredicateCall {
  type: 'AtomicPredicateCall'
  source: string
}

export interface InputPredicateCall {
  type: 'InputPredicateCall'
  source: NormalInput
}

export interface VariablePredicateCall {
  type: 'VariablePredicateCall'
}

/**
 * challengeInput -1
 * inputs[0] is 0
 * inputs[0].inputs[0] is [0, 0]
 */
export type CompiledInput =
  | ConstantInput
  | LabelInput
  | NormalInput
  | VariableInput
  | SelfInput

export interface ConstantInput {
  type: 'ConstantInput'
  name: string
}

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

export interface SelfInput {
  type: 'SelfInput'
  children: number[]
}

// LogicalConnective
export enum LogicalConnective {
  And = 'And',
  ForAllSuchThat = 'ForAllSuchThat',
  Not = 'Not',
  Or = 'Or',
  ThereExistsSuchThat = 'ThereExistsSuchThat'
}

export type LogicalConnectiveStrings = keyof typeof LogicalConnective

export function convertStringToLogicalConnective(
  name: LogicalConnectiveStrings
): LogicalConnective {
  return LogicalConnective[name]
}
