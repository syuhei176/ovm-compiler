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
import { Parser } from '@cryptoeconomicslab/ovm-parser'
import {
  SolidityCodeGeneratorOptions,
  SolidityCodeGenerator
} from '@cryptoeconomicslab/ovm-solidity-generator'
import { EthereumCodeGenerator } from '@cryptoeconomicslab/ovm-ethereum-generator'
import { transpilePropertyDefsToCompiledPredicate } from '@cryptoeconomicslab/ovm-transpiler'

export async function generateSolidityCode(
  source: string,
  options?: SolidityCodeGeneratorOptions
): Promise<string> {
  const chamberParser = new Parser()
  const compiledPredicates = transpilePropertyDefsToCompiledPredicate(
    chamberParser.parse(source)
  )
  const codeGenerator = new SolidityCodeGenerator(options)
  return codeGenerator.generate(compiledPredicates)
}

export async function generateEVMByteCode(
  source: string,
  options?: SolidityCodeGeneratorOptions
): Promise<string> {
  const chamberParser = new Parser()
  const compiledPredicates = transpilePropertyDefsToCompiledPredicate(
    chamberParser.parse(source)
  )
  const codeGenerator = new EthereumCodeGenerator(options)
  return codeGenerator.generate(compiledPredicates)
}
