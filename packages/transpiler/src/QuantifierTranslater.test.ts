import { translateQuantifier } from './QuantifierTranslater'
import { PropertyDef } from '@cryptoeconomicslab/ovm-parser/lib/PropertyDef'

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
              'signatures,KEY,${a}',
              'sig',
              {
                type: 'PropertyNode',
                predicate: 'IsValidSignature',
                inputs: ['a', 'sig', 'b', '$secp256k1']
              }
            ]
          }
        }
      ])
    })

    test('IsLessThan', () => {
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
                predicate: 'IsLessThan',
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
              'range,NUMBER,0000000000000000000000000000000000000000000000000000000000000000${b}',
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
                        predicate: 'IsLessThan',
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

    test('SU', () => {
      const input: PropertyDef[] = [
        {
          name: 'SUTest',
          inputDefs: ['token', 'range', 'block'],
          body: {
            type: 'PropertyNode',
            predicate: 'ForAllSuchThat',
            inputs: [
              {
                type: 'PropertyNode',
                predicate: 'SU',
                inputs: ['token', 'range', 'block']
              },
              'su',
              {
                type: 'PropertyNode',
                predicate: 'Foo',
                inputs: ['su']
              }
            ]
          }
        }
      ]
      const output = translateQuantifier(input)
      expect(output).toStrictEqual([
        {
          name: 'SUTest',
          inputDefs: ['token', 'range', 'block'],
          body: {
            type: 'PropertyNode',
            predicate: 'ForAllSuchThat',
            inputs: [
              'su.block${token}.range${range},RANGE,${block}',
              'su',
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
                        predicate: 'IncludedWithin',
                        inputs: ['su', 'range', 'block', 'token']
                      }
                    ]
                  },
                  { type: 'PropertyNode', predicate: 'Foo', inputs: ['su'] }
                ]
              }
            ]
          }
        }
      ])
    })

    test('Tx', () => {
      const input: PropertyDef[] = [
        {
          name: 'TxTest',
          inputDefs: ['token', 'range', 'block'],
          body: {
            type: 'PropertyNode',
            predicate: 'ThereExistsSuchThat',
            inputs: [
              {
                type: 'PropertyNode',
                predicate: 'Tx',
                inputs: ['token', 'range', 'block']
              },
              'tx',
              {
                type: 'PropertyNode',
                predicate: 'Foo',
                inputs: ['tx']
              }
            ]
          }
        }
      ]
      const output = translateQuantifier(input)
      expect(output).toStrictEqual([
        {
          name: 'TxTest',
          inputDefs: ['token', 'range', 'block'],
          body: {
            type: 'PropertyNode',
            predicate: 'ThereExistsSuchThat',
            inputs: [
              'tx.block${block}.range${token},RANGE,${range}',
              'tx',
              {
                type: 'PropertyNode',
                predicate: 'And',
                inputs: [
                  {
                    type: 'PropertyNode',
                    predicate: 'Equal',
                    inputs: ['tx.address', '$TransactionAddress']
                  },
                  {
                    type: 'PropertyNode',
                    predicate: 'Equal',
                    inputs: ['tx.0', 'token']
                  },
                  {
                    type: 'PropertyNode',
                    predicate: 'IsContained',
                    inputs: ['tx.1', 'range']
                  },
                  {
                    type: 'PropertyNode',
                    predicate: 'Equal',
                    inputs: ['tx.2', 'block']
                  },
                  { type: 'PropertyNode', predicate: 'Foo', inputs: ['tx'] }
                ]
              }
            ]
          }
        }
      ])
    })
  })
})
