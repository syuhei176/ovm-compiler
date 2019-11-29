/**
 * # Parse
 * predicate logic to model
 * # Code generation
 * model to Solidity
 * model to transaction
 * # Model to model
 * not general to general
 * compile
 * disassemble
 */
import { Parser } from './parser'
import { SolidityCodeGenerator } from './generator'
import { Transpiler } from './transpiler'

export { Parser, SolidityCodeGenerator, Transpiler }

export function generateSolidityCode(source: string): string {
  const parser = new Parser()
  const compiledPredicates = Transpiler.calculateInteractiveNodes(
    parser.parse(source)
  )
  const generator = new SolidityCodeGenerator()
  return generator.generate(compiledPredicates)
}
