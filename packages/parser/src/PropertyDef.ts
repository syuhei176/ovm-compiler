/**
 * Parsed Property definition
 */
export interface PropertyDef {
  name: string
  inputDefs: string[]
  body: PropertyNode
}

export interface PropertyNode {
  type: 'PropertyNode'
  predicate: string
  inputs: Input[]
}

type Input = string | PropertyNode | undefined
