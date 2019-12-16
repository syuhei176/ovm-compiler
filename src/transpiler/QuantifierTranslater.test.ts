import { translateQuantifier } from './QuantifierTranslater'
import { PropertyDef } from '../parser/PropertyDef'

describe('QuantifierTranslater', () => {
  beforeEach(async () => {})
  describe('translateQuantifier', () => {
    test('SignedBy', () => {
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

    test('LessThan', () => {
      const input: PropertyDef[] = [
        {
          name: 'LessThanTest',
          inputDefs: ['b'],
          body: {
            type: 'PropertyNode',
            predicate: 'ForAllSuchThat',
            inputs: [
              {
                type: 'PropertyNode',
                predicate: 'LessThan',
                inputs: ['b']
              },
              'bb',
              {
                type: 'PropertyNode',
                predicate: 'Foo',
                inputs: ['bb']
              }
            ]
          }
        }
      ]
      const output = translateQuantifier(input)
      expect(output).toStrictEqual([
        {
          name: 'LessThanTest',
          inputDefs: ['b'],
          body: {
            type: 'PropertyNode',
            predicate: 'ForAllSuchThat',
            inputs: [
              'lessthan::${b}',
              'bb',
              {
                type: 'PropertyNode',
                predicate: 'Or',
                inputs: [
                  {
                    type: 'PropertyNode',
                    predicate: 'Not',
                    inputs: [
                      {
                        type: 'PropertyNode',
                        predicate: 'LessThan',
                        inputs: ['bb', 'b']
                      }
                    ]
                  },
                  { type: 'PropertyNode', predicate: 'Foo', inputs: ['bb'] }
                ]
              }
            ]
          }
        }
      ])
    })
  })
})
