import { CompiledPredicate } from '../transpiler'

export interface CodeGenerator {
  generate(claimDefs: CompiledPredicate[]): Promise<string>
}
