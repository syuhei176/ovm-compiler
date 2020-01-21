import {
  SolidityCodeGeneratorOptions,
  SolidityCodeGenerator
} from './SolidityCodeGenerator'
import { Parser } from '@cryptoeconomicslab/ovm-parser'
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

export { SolidityCodeGeneratorOptions, SolidityCodeGenerator }
