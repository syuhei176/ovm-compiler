import ejs from 'ejs'
import templateSource from './sol'
import decide from './decide'
import getChild from './getChild'
import constructProperty from './constructProperty'
import constructInputs from './constructInputs'
import decideProperty from './decideProperty'
import { CodeGenerator } from '../CodeGenerator'
import { CompiledPredicate, AtomicProposition } from '../../transpiler'

const templates: { [key: string]: string } = {
  decide: decide.toString(),
  getChild: getChild.toString(),
  constructProperty: constructProperty.toString(),
  constructInputs: constructInputs.toString(),
  decideProperty: decideProperty.toString()
}

export interface SolidityCodeGeneratorOptions {
  addressTable: { [key: string]: string }
  ovmPath?: string
}

const defaultOVMPath = 'ovm-contracts'

export class SolidityCodeGenerator implements CodeGenerator {
  constructor(
    readonly options: SolidityCodeGeneratorOptions = {
      addressTable: {},
      ovmPath: defaultOVMPath
    }
  ) {}
  generate(compiledPredicates: CompiledPredicate[]) {
    const template = ejs.compile(templateSource.toString(), { client: true })
    const output = template(
      {
        compiledPredicates,
        ...this.getHelpers()
      },
      undefined,
      this.includeCallback
    )
    return output
  }

  includeCallback = (filename: string, d: any) => {
    const template = ejs.compile(templates[filename], {
      client: true
    })
    return template(
      { ...this.getHelpers(), ...d },
      undefined,
      this.includeCallback
    )
  }

  getOVMPath = () => {
    return this.options.ovmPath || defaultOVMPath
  }
  getAddress = (predicateName: string) => {
    return (
      this.options.addressTable[predicateName] ||
      '0x0000000000000000000000000000000000000000'
    )
  }
  indent = (text: string, depth: number) => {
    return text
      .split('\n')
      .map(function(line, num) {
        if (!!line) {
          for (var i = 0; i < depth; i++) {
            line = ' ' + line
          }
        }
        return line
      })
      .join('\n')
  }
  getHelpers = () => {
    return {
      getAddress: this.getAddress,
      indent: this.indent,
      getOVMPath: this.getOVMPath
    }
  }
}
