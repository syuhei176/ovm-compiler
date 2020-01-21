import { Parser } from '@cryptoeconomicslab/ovm-parser'
import { EthereumCodeGenerator } from './EthereumCodeGenerator'
import { transpilePropertyDefsToCompiledPredicate } from '@cryptoeconomicslab/ovm-transpiler'
import { SolidityCodeGeneratorOptions } from '@cryptoeconomicslab/ovm-solidity-generator'
import Coder from '@cryptoeconomicslab/coder'
import { setupContext } from '@cryptoeconomicslab/context'
setupContext({ coder: Coder })

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
export { EthereumCodeGenerator }
