import { translateQuantifier } from './QuantifierTranslater'
import { PropertyDef } from '../parser/PropertyDef'

describe('QuantifierTranslater', () => {
  beforeEach(async () => {})
  describe('translateQuantifier', () => {
    test('and', () => {
      const input: PropertyDef[] = [
        {
          name: 'SignedByTest',
          inputDefs: ['a', 'b'],
          body: {
            type: 'PropertyNode',
            predicate: 'SignedBy',
            inputs: ['a', 'b']
          }
        }
      ]
      const output = translateQuantifier(input)
      expect(output).toStrictEqual([
        {
          name: 'SignedByTest',
          inputDefs: ['a', 'b'],
          body: {
            type: 'PropertyNode',
            predicate: 'ThereExistsSuchThat',
            inputs: [
              'key:signatures:${a}',
              'sig',
              {
                type: 'PropertyNode',
                predicate: 'IsValidSignature',
                inputs: ['a', 'b', 'sig']
              }
            ]
          }
        }
      ])
    })
  })
})
