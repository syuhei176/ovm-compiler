import {
  SolidityCodeGeneratorOptions,
  SolidityCodeGenerator
} from './SolidityCodeGenerator'
import { Parser } from '@cryptoeconomicslab/ovm-parser'
import { transpile } from '@cryptoeconomicslab/ovm-transpiler'
import Coder from '@cryptoeconomicslab/coder'
import { setupContext } from '@cryptoeconomicslab/context'
setupContext({ coder: Coder })

export async function generateSolidityCode(
  source: string,
  options?: SolidityCodeGeneratorOptions
): Promise<string> {
  const chamberParser = new Parser()
  const compiledPredicates = transpile(chamberParser.parse(source))
  const codeGenerator = new SolidityCodeGenerator(options)
  return codeGenerator.generate(compiledPredicates)
}

export { SolidityCodeGeneratorOptions, SolidityCodeGenerator }
