import { PropertyDef, Transpiler } from './'

describe('Transpiler', () => {
  beforeEach(async () => {})
  describe('calculateInteractiveNodes', () => {
    test('return calculated interactive nodes', () => {
      const input: PropertyDef[] = [
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
      ]
      const output = Transpiler.calculateInteractiveNodes(input)
      expect(output).toEqual([
        {
          type: 'CompiledPredicate',
          name: 'Test',
          inputDefs: ['a'],
          contracts: [
            {
              definition: {
                type: 'IntermediateCompiledPredicateDef',
                inputDefs: ['TestFA', 'b'],
                name: 'TestFA',
                predicate: 'And',
                inputs: [
                  {
                    inputs: [1],
                    predicate: 'Foo',
                    type: 'AtomicProposition'
                  },
                  {
                    inputs: [1],
                    predicate: 'Bar',
                    type: 'AtomicProposition'
                  }
                ]
              },
              isCompiled: true,
              originalPredicateName: 'Test',
              type: 'IntermediateCompiledPredicate'
            },
            {
              definition: {
                type: 'IntermediateCompiledPredicateDef',
                inputs: [
                  {
                    inputs: [1],
                    predicate: 'A',
                    type: 'AtomicProposition'
                  },
                  {
                    inputs: [-1, -1],
                    predicate: 'TestFA',
                    type: 'AtomicProposition'
                  }
                ],
                predicate: 'ForAllSuchThat',
                inputDefs: ['TestF', 'a'],
                name: 'TestF'
              },
              isCompiled: true,
              originalPredicateName: 'Test',
              type: 'IntermediateCompiledPredicate'
            }
          ]
        }
      ])
    })

    test('with bind operator', () => {
      const input: PropertyDef[] = [
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
      ]
      const output = Transpiler.calculateInteractiveNodes(input)
      expect(output).toEqual([
        {
          type: 'CompiledPredicate',
          name: 'ChildEq',
          inputDefs: ['a'],
          contracts: [
            {
              type: 'IntermediateCompiledPredicate',
              isCompiled: true,
              originalPredicateName: 'ChildEq',
              definition: {
                type: 'IntermediateCompiledPredicateDef',
                name: 'ChildEqT',
                inputDefs: ['ChildEqT', 'a'],
                predicate: 'ThereExistsSuchThat',
                inputs: [
                  { predicate: 'Bytes', type: 'AtomicProposition', inputs: [] },
                  {
                    inputs: [[-1, 0], 1],
                    predicate: 'equal',
                    type: 'AtomicProposition'
                  }
                ]
              }
            }
          ]
        }
      ])
    })

    test('order', () => {
      const input: PropertyDef[] = [
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
      ]

      const output = Transpiler.calculateInteractiveNodes(input)
      // console.log(JSON.stringify(output))
      expect(output).toEqual([
        {
          type: 'CompiledPredicate',
          name: 'Order',
          inputDefs: ['maker', 'c_token', 'c_amount', 'min_block_number'],
          contracts: [
            {
              type: 'IntermediateCompiledPredicate',
              isCompiled: true,
              originalPredicateName: 'Order',
              definition: {
                type: 'IntermediateCompiledPredicateDef',
                name: 'OrderTA2TA5O1A',
                predicate: 'And',
                inputDefs: ['OrderTA2TA5O1A', 'c_su', 'tx'],
                inputs: [
                  {
                    type: 'AtomicProposition',
                    predicate: 'withdraw',
                    inputs: [1]
                  },
                  {
                    type: 'AtomicProposition',
                    predicate: 'IsValidSignature',
                    inputs: [2, [1, 3]]
                  }
                ]
              }
            },
            {
              type: 'IntermediateCompiledPredicate',
              isCompiled: true,
              originalPredicateName: 'Order',
              definition: {
                type: 'IntermediateCompiledPredicateDef',
                name: 'OrderTA2TA5O2A1N',
                predicate: 'Not',
                inputDefs: ['OrderTA2TA5O2A1N', 'c_su'],
                inputs: [
                  {
                    type: 'AtomicProposition',
                    predicate: 'withdraw',
                    inputs: [1]
                  }
                ]
              }
            },
            {
              type: 'IntermediateCompiledPredicate',
              isCompiled: true,
              originalPredicateName: 'Order',
              definition: {
                type: 'IntermediateCompiledPredicateDef',
                name: 'OrderTA2TA5O2A',
                predicate: 'And',
                inputDefs: ['OrderTA2TA5O2A', 'c_su', 'tx', 'maker'],
                inputs: [
                  {
                    type: 'AtomicProposition',
                    predicate: 'OrderTA2TA5O2A1N',
                    inputs: [-1, 1]
                  },
                  {
                    type: 'AtomicProposition',
                    predicate: 'IsValidSignature',
                    inputs: [2, 3]
                  }
                ]
              }
            },
            {
              type: 'IntermediateCompiledPredicate',
              isCompiled: true,
              originalPredicateName: 'Order',
              definition: {
                type: 'IntermediateCompiledPredicateDef',
                name: 'OrderTA2TA5O',
                predicate: 'Or',
                inputDefs: ['OrderTA2TA5O', 'c_su', 'tx', 'maker'],
                inputs: [
                  {
                    type: 'AtomicProposition',
                    predicate: 'OrderTA2TA5O1A',
                    inputs: [-1, 1, 2]
                  },
                  {
                    type: 'AtomicProposition',
                    predicate: 'OrderTA2TA5O2A',
                    inputs: [-1, 1, 2, 3]
                  }
                ]
              }
            },
            {
              type: 'IntermediateCompiledPredicate',
              isCompiled: true,
              originalPredicateName: 'Order',
              definition: {
                type: 'IntermediateCompiledPredicateDef',
                name: 'OrderTA2TA',
                predicate: 'And',
                inputDefs: [
                  'OrderTA2TA',
                  'c_su',
                  'c_token',
                  'c_amount',
                  'min_block_number',
                  'maker',
                  'tx'
                ],
                inputs: [
                  {
                    type: 'AtomicProposition',
                    predicate: 'assert',
                    inputs: [[1, 0], 2]
                  },
                  {
                    type: 'AtomicProposition',
                    predicate: 'checkAmount',
                    inputs: [[1, 1], 3]
                  },
                  {
                    type: 'AtomicProposition',
                    predicate: 'gte',
                    inputs: [[1, 2], 4]
                  },
                  {
                    type: 'AtomicProposition',
                    predicate: 'assert',
                    inputs: [[1, 3], 5]
                  },
                  {
                    type: 'AtomicProposition',
                    predicate: 'OrderTA2TA5O',
                    inputs: [-1, 1, 6, 5]
                  }
                ]
              }
            },
            {
              type: 'IntermediateCompiledPredicate',
              isCompiled: true,
              originalPredicateName: 'Order',
              definition: {
                type: 'IntermediateCompiledPredicateDef',
                name: 'OrderTA2T',
                predicate: 'ThereExistsSuchThat',
                inputDefs: [
                  'OrderTA2T',
                  'c_token',
                  'c_amount',
                  'min_block_number',
                  'maker',
                  'tx'
                ],
                inputs: [
                  { type: 'AtomicProposition', predicate: 'SU', inputs: [] },
                  {
                    type: 'AtomicProposition',
                    predicate: 'OrderTA2TA',
                    inputs: [-1, -1, 1, 2, 3, 4, 5]
                  }
                ]
              }
            },
            {
              type: 'IntermediateCompiledPredicate',
              isCompiled: true,
              originalPredicateName: 'Order',
              definition: {
                type: 'IntermediateCompiledPredicateDef',
                name: 'OrderTA',
                predicate: 'And',
                inputDefs: [
                  'OrderTA',
                  'tx',
                  'self',
                  'c_token',
                  'c_amount',
                  'min_block_number',
                  'maker'
                ],
                inputs: [
                  {
                    type: 'AtomicProposition',
                    predicate: 'SameRange',
                    inputs: [1, 2]
                  },
                  {
                    type: 'AtomicProposition',
                    predicate: 'OrderTA2T',
                    inputs: [-1, 3, 4, 5, 6, 1]
                  }
                ]
              }
            },
            {
              type: 'IntermediateCompiledPredicate',
              isCompiled: true,
              originalPredicateName: 'Order',
              definition: {
                type: 'IntermediateCompiledPredicateDef',
                name: 'OrderT',
                predicate: 'ThereExistsSuchThat',
                inputDefs: [
                  'OrderT',
                  'self',
                  'c_token',
                  'c_amount',
                  'min_block_number',
                  'maker'
                ],
                inputs: [
                  { type: 'AtomicProposition', predicate: 'Bytes', inputs: [] },
                  {
                    type: 'AtomicProposition',
                    predicate: 'OrderTA',
                    inputs: [-1, -1, 1, 2, 3, 4, 5]
                  }
                ]
              }
            }
          ]
        },
        {
          type: 'CompiledPredicate',
          name: 'Exit_correspondent',
          inputDefs: ['c_su', 'maker'],
          contracts: [
            {
              type: 'IntermediateCompiledPredicate',
              isCompiled: true,
              originalPredicateName: 'Exit_correspondent',
              definition: {
                type: 'IntermediateCompiledPredicateDef',
                name: 'Exit_correspondentO1A',
                predicate: 'And',
                inputDefs: ['Exit_correspondentO1A', 'c_su'],
                inputs: [
                  { type: 'AtomicProposition', predicate: 'exit', inputs: [1] },
                  {
                    type: 'AtomicProposition',
                    predicate: 'deposit_exists',
                    inputs: [
                      [1, 0],
                      [1, 1]
                    ]
                  }
                ]
              }
            },
            {
              type: 'IntermediateCompiledPredicate',
              isCompiled: true,
              originalPredicateName: 'Exit_correspondent',
              definition: {
                type: 'IntermediateCompiledPredicateDef',
                name: 'Exit_correspondentO2T',
                predicate: 'ThereExistsSuchThat',
                inputDefs: ['Exit_correspondentO2T', 'c_su', 'maker'],
                inputs: [
                  {
                    type: 'AtomicProposition',
                    predicate: 'Tx',
                    inputs: [[1, 1]]
                  },
                  {
                    type: 'AtomicProposition',
                    predicate: 'IsValidSignature',
                    inputs: [2]
                  }
                ]
              }
            },
            {
              type: 'IntermediateCompiledPredicate',
              isCompiled: true,
              originalPredicateName: 'Exit_correspondent',
              definition: {
                type: 'IntermediateCompiledPredicateDef',
                name: 'Exit_correspondentO',
                predicate: 'Or',
                inputDefs: ['Exit_correspondentO', 'c_su', 'maker'],
                inputs: [
                  {
                    type: 'AtomicProposition',
                    predicate: 'Exit_correspondentO1A',
                    inputs: [-1, 1]
                  },
                  {
                    type: 'AtomicProposition',
                    predicate: 'Exit_correspondentO2T',
                    inputs: [-1, 1, 2]
                  }
                ]
              }
            }
          ]
        }
      ])
    })
  })
})
