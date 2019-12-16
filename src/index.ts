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
import * as parser from './parser'
import * as generator from './generator'
import * as transpiler from './transpiler'

export { parser, generator, transpiler }

export function generateSolidityCode(
  source: string,
  options?: generator.SolidityCodeGeneratorOptions
): string {
  const chamberParser = new parser.Parser()
  const compiledPredicates = transpiler.transpilePropertyDefsToCompiledPredicate(
    chamberParser.parse(source)
  )
  const codeGenerator = new generator.SolidityCodeGenerator(options)
  return codeGenerator.generate(compiledPredicates)
}
