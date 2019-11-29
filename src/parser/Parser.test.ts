import { Parser } from './Parser'
import { PropertyDef } from '../transpiler/PropertyDef'
import fs from 'fs'
import path from 'path'

describe('Parser', () => {
  let parser: Parser
  beforeEach(async () => {
    parser = new Parser()
  })
  describe('parse', () => {
    test('return abstract syntax tree', () => {
      const ast: PropertyDef[] = parser.parse(
        'def test(a) := for b in A(a) {Foo(b) and Bar(b)}'
      )
      expect(ast).toStrictEqual([
        {
          name: 'test',
          inputDefs: ['a'],
          body: {
            type: 'PropertyNode',
            inputs: [
              {
                type: 'PropertyNode',
                inputs: ['a'],
                predicate: 'A'
              },
              'b',
              {
                type: 'PropertyNode',
                inputs: [
                  {
                    type: 'PropertyNode',
                    inputs: ['b'],
                    predicate: 'Foo'
                  },
                  {
                    type: 'PropertyNode',
                    inputs: ['b'],
                    predicate: 'Bar'
                  }
                ],
                predicate: 'And'
              }
            ],
            predicate: 'ForAllSuchThat'
          }
        }
      ])
    })

    test('bind operator', () => {
      const ast: PropertyDef[] = parser.parse(
        'def childEq(a) := with Bytes() as b {equal(b.0, a)}'
      )
      expect(ast).toStrictEqual([
        {
          name: 'childEq',
          inputDefs: ['a'],
          body: {
            type: 'PropertyNode',
            predicate: 'ThereExistsSuchThat',
            inputs: [
              {
                predicate: 'Bytes',
                type: 'PropertyNode',
                inputs: []
              },
              'b',
              {
                inputs: ['b.0', 'a'],
                predicate: 'equal',
                type: 'PropertyNode'
              }
            ]
          }
        }
      ])
    })

    test('order', () => {
      const testOutput = fs
        .readFileSync(path.join(__dirname, '../../examples/order/order.txt'))
        .toString()
      const ast: PropertyDef[] = parser.parse(testOutput)
      // console.log(JSON.stringify(ast))
      expect(ast).toStrictEqual([
        {
          name: 'order',
          inputDefs: ['maker', 'c_token', 'c_amount', 'min_block_number'],
          body: {
            type: 'PropertyNode',
            predicate: 'ThereExistsSuchThat',
            inputs: [
              { type: 'PropertyNode', predicate: 'Bytes', inputs: [] },
              'tx',
              {
                type: 'PropertyNode',
                predicate: 'And',
                inputs: [
                  {
                    type: 'PropertyNode',
                    predicate: 'SameRange',
                    inputs: ['tx', 'self']
                  },
                  {
                    type: 'PropertyNode',
                    predicate: 'ThereExistsSuchThat',
                    inputs: [
                      { type: 'PropertyNode', predicate: 'SU', inputs: [] },
                      'c_su',
                      {
                        type: 'PropertyNode',
                        predicate: 'And',
                        inputs: [
                          {
                            type: 'PropertyNode',
                            predicate: 'assert',
                            inputs: ['c_su.0', 'c_token']
                          },
                          {
                            type: 'PropertyNode',
                            predicate: 'checkAmount',
                            inputs: ['c_su.1', 'c_amount']
                          },
                          {
                            type: 'PropertyNode',
                            predicate: 'gte',
                            inputs: ['c_su.2', 'min_block_number']
                          },
                          {
                            type: 'PropertyNode',
                            predicate: 'assert',
                            inputs: ['c_su.3', 'maker']
                          },
                          {
                            type: 'PropertyNode',
                            predicate: 'Or',
                            inputs: [
                              {
                                type: 'PropertyNode',
                                predicate: 'And',
                                inputs: [
                                  {
                                    type: 'PropertyNode',
                                    predicate: 'withdraw',
                                    inputs: ['c_su']
                                  },
                                  {
                                    type: 'PropertyNode',
                                    predicate: 'IsValidSignature',
                                    inputs: ['tx', 'c_su.3']
                                  }
                                ]
                              },
                              {
                                type: 'PropertyNode',
                                predicate: 'And',
                                inputs: [
                                  {
                                    type: 'PropertyNode',
                                    predicate: 'Not',
                                    inputs: [
                                      {
                                        type: 'PropertyNode',
                                        predicate: 'withdraw',
                                        inputs: ['c_su']
                                      }
                                    ]
                                  },
                                  {
                                    type: 'PropertyNode',
                                    predicate: 'IsValidSignature',
                                    inputs: ['tx', 'maker']
                                  }
                                ]
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        },
        {
          name: 'exit_correspondent',
          inputDefs: ['c_su', 'maker'],
          body: {
            type: 'PropertyNode',
            predicate: 'Or',
            inputs: [
              {
                type: 'PropertyNode',
                predicate: 'And',
                inputs: [
                  { type: 'PropertyNode', predicate: 'exit', inputs: ['c_su'] },
                  {
                    type: 'PropertyNode',
                    predicate: 'deposit_exists',
                    inputs: ['c_su.0', 'c_su.1']
                  }
                ]
              },
              {
                type: 'PropertyNode',
                predicate: 'ThereExistsSuchThat',
                inputs: [
                  { type: 'PropertyNode', predicate: 'Tx', inputs: ['c_su.1'] },
                  'tx',
                  {
                    type: 'PropertyNode',
                    predicate: 'IsValidSignature',
                    inputs: ['maker']
                  }
                ]
              }
            ]
          }
        }
      ])
    })
  })
})
