import peg from 'pegjs'
import chamberPeg from './chamber'
import { PropertyDef } from './PropertyDef'

export class Parser {
  parse(src: string): PropertyDef[] {
    const parser = peg.generate(chamberPeg)
    return parser.parse(src)
  }
}
