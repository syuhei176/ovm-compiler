import peg from 'pegjs'
import chamberPeg from './chamber'

export class Parser {
  parse(src: string): any {
    const parser = peg.generate(chamberPeg)
    return parser.parse(src)
  }
}
