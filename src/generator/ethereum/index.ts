import {
  SolidityCodeGeneratorOptions,
  SolidityCodeGenerator
} from '../solidity'
import { CompiledPredicate } from '../../transpiler'
import solc from 'solc'
import { CodeGenerator } from '../CodeGenerator'
import { basename } from 'path'
import template from './template'

export class EthereumCodeGenerator implements CodeGenerator {
  constructor(readonly options?: SolidityCodeGeneratorOptions) {}
  generate(compiledPredicates: CompiledPredicate[]): string {
    const solidityGenerator = new SolidityCodeGenerator(this.options)
    const source = solidityGenerator.generate(compiledPredicates)

    const input = {
      language: 'Solidity',
      sources: {
        'test.sol': {
          content: source
        }
      },
      settings: {
        outputSelection: {
          '*': {
            '*': [
              'evm.bytecode.object',
              'evm.deployedBytecode.object',
              'abi',
              'evm.bytecode.sourceMap',
              'evm.deployedBytecode.sourceMap'
            ],

            '': ['ast']
          }
        }
      }
    }

    const outputString = solc.compile(JSON.stringify(input), (path: string) => {
      return { contents: template[basename(path, '.sol')] }
    })
    const output = JSON.parse(outputString)
    return JSON.stringify(output.contracts['test.sol'])
  }
}
