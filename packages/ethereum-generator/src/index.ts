import { Parser, Import } from '@cryptoeconomicslab/ovm-parser'
import { EthereumCodeGenerator } from './EthereumCodeGenerator'
import { transpile, ImportHandler } from '@cryptoeconomicslab/ovm-transpiler'
import { SolidityCodeGeneratorOptions } from '@cryptoeconomicslab/ovm-solidity-generator'
import Coder from '@cryptoeconomicslab/coder'
import { setupContext } from '@cryptoeconomicslab/context'
// Set default JSON coder because code generator doesn't use hint data.
setupContext({ coder: Coder })

export async function generateEVMByteCode(
  source: string,
  importHandler: (_import: Import) => string,
  options?: SolidityCodeGeneratorOptions
): Promise<string> {
  const chamberParser = new Parser()
  const compiledPredicates = transpile(
    chamberParser.parse(source),
    (_import: Import) => {
      return chamberParser.parse(importHandler(_import))
    },
    {}
  )
  const codeGenerator = new EthereumCodeGenerator(options)
  return codeGenerator.generate(compiledPredicates)
}
export { EthereumCodeGenerator }
