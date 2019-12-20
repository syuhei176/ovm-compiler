import { createCompiledPredicates } from './ContractCompiler'
import { PropertyDef } from '../parser/PropertyDef'
import { LogicalConnective } from './CompiledPredicate'

describe('ContractCompiler', () => {
  beforeEach(async () => {})
  describe('createCompiledPredicates', () => {
    describe('operator', () => {
      test('and', () => {
        const input: PropertyDef[] = [
          {
            name: 'andTest',
            inputDefs: ['a', 'b'],
            body: {
              type: 'PropertyNode',
              predicate: 'And',
              inputs: [
                { type: 'PropertyNode', predicate: 'Foo', inputs: ['a'] },
                { type: 'PropertyNode', predicate: 'Bar', inputs: ['b'] }
              ]
            }
          }
        ]
        const output = createCompiledPredicates(input)
        expect(output).toStrictEqual([
          {
            type: 'CompiledPredicate',
            name: 'AndTest',
            inputDefs: ['a', 'b'],
            contracts: [
              {
                type: 'IntermediateCompiledPredicate',
                isCompiled: true,
                originalPredicateName: 'AndTest',
                definition: {
                  type: 'IntermediateCompiledPredicateDef',
                  name: 'AndTestA',
                  connective: LogicalConnective.And,
                  inputDefs: ['AndTestA', 'a', 'b'],
                  inputs: [
                    {
                      type: 'AtomicProposition',
                      predicate: { type: 'AtomicPredicateCall', source: 'Foo' },
                      inputs: [
                        { type: 'NormalInput', inputIndex: 1, children: [] }
                      ]
                    },
                    {
                      type: 'AtomicProposition',
                      predicate: { type: 'AtomicPredicateCall', source: 'Bar' },
                      inputs: [
                        { type: 'NormalInput', inputIndex: 2, children: [] }
                      ]
                    }
                  ],
                  propertyInputs: []
                }
              }
            ],
            entryPoint: 'AndTestA'
          }
        ])
      })
      test('or', () => {
        const input: PropertyDef[] = [
          {
            name: 'orTest',
            inputDefs: ['a', 'b'],
            body: {
              type: 'PropertyNode',
              predicate: 'Or',
              inputs: [
                { type: 'PropertyNode', predicate: 'Foo', inputs: ['a'] },
                { type: 'PropertyNode', predicate: 'Bar', inputs: ['b'] }
              ]
            }
          }
        ]
        const output = createCompiledPredicates(input)
        expect(output).toStrictEqual([
          {
            type: 'CompiledPredicate',
            name: 'OrTest',
            inputDefs: ['a', 'b'],
            contracts: [
              {
                type: 'IntermediateCompiledPredicate',
                isCompiled: true,
                originalPredicateName: 'OrTest',
                definition: {
                  type: 'IntermediateCompiledPredicateDef',
                  name: 'OrTestO',
                  connective: LogicalConnective.Or,
                  inputDefs: ['OrTestO', 'a', 'b'],
                  inputs: [
                    {
                      type: 'AtomicProposition',
                      predicate: { type: 'AtomicPredicateCall', source: 'Foo' },
                      inputs: [
                        { type: 'NormalInput', inputIndex: 1, children: [] }
                      ]
                    },
                    {
                      type: 'AtomicProposition',
                      predicate: { type: 'AtomicPredicateCall', source: 'Bar' },
                      inputs: [
                        { type: 'NormalInput', inputIndex: 2, children: [] }
                      ]
                    }
                  ],
                  propertyInputs: []
                }
              }
            ],
            entryPoint: 'OrTestO'
          }
        ])
      })
      test('not', () => {
        const input: PropertyDef[] = [
          {
            name: 'notTest',
            inputDefs: ['a'],
            body: {
              type: 'PropertyNode',
              predicate: 'Not',
              inputs: [
                { type: 'PropertyNode', predicate: 'Foo', inputs: ['a'] }
              ]
            }
          }
        ]
        const output = createCompiledPredicates(input)
        expect(output).toStrictEqual([
          {
            type: 'CompiledPredicate',
            name: 'NotTest',
            inputDefs: ['a'],
            contracts: [
              {
                type: 'IntermediateCompiledPredicate',
                isCompiled: true,
                originalPredicateName: 'NotTest',
                definition: {
                  type: 'IntermediateCompiledPredicateDef',
                  name: 'NotTestN',
                  connective: LogicalConnective.Not,
                  inputDefs: ['NotTestN', 'a'],
                  inputs: [
                    {
                      type: 'AtomicProposition',
                      predicate: { type: 'AtomicPredicateCall', source: 'Foo' },
                      inputs: [
                        { type: 'NormalInput', inputIndex: 1, children: [] }
                      ]
                    }
                  ],
                  propertyInputs: []
                }
              }
            ],
            entryPoint: 'NotTestN'
          }
        ])
      })
      test('forall', () => {
        const input: PropertyDef[] = [
          {
            name: 'forallTest',
            inputDefs: ['a'],
            body: {
              type: 'PropertyNode',
              predicate: 'ForAllSuchThat',
              inputs: [
                { type: 'PropertyNode', predicate: 'A', inputs: ['a'] },
                'b',
                { type: 'PropertyNode', predicate: 'Foo', inputs: ['b'] }
              ]
            }
          }
        ]
        const output = createCompiledPredicates(input)
        expect(output).toStrictEqual([
          {
            type: 'CompiledPredicate',
            name: 'ForallTest',
            inputDefs: ['a'],
            contracts: [
              {
                type: 'IntermediateCompiledPredicate',
                isCompiled: true,
                originalPredicateName: 'ForallTest',
                definition: {
                  type: 'IntermediateCompiledPredicateDef',
                  name: 'ForallTestF',
                  connective: LogicalConnective.ForAllSuchThat,
                  inputDefs: ['ForallTestF', 'a'],
                  inputs: [
                    {
                      type: 'AtomicProposition',
                      predicate: { type: 'AtomicPredicateCall', source: 'A' },
                      inputs: [
                        { type: 'NormalInput', inputIndex: 1, children: [] }
                      ]
                    },
                    'b',
                    {
                      type: 'AtomicProposition',
                      predicate: { type: 'AtomicPredicateCall', source: 'Foo' },
                      inputs: [
                        {
                          type: 'VariableInput',
                          placeholder: 'b',
                          children: []
                        }
                      ]
                    }
                  ],
                  propertyInputs: []
                }
              }
            ],
            entryPoint: 'ForallTestF'
          }
        ])
      })
      test('there', () => {
        const input: PropertyDef[] = [
          {
            name: 'thereTest',
            inputDefs: [],
            body: {
              type: 'PropertyNode',
              predicate: 'ThereExistsSuchThat',
              inputs: [
                'hint:hint:hint',
                'a',
                { type: 'PropertyNode', predicate: 'Foo', inputs: ['a'] }
              ]
            }
          }
        ]
        const output = createCompiledPredicates(input)
        expect(output).toStrictEqual([
          {
            type: 'CompiledPredicate',
            name: 'ThereTest',
            inputDefs: [],
            contracts: [
              {
                type: 'IntermediateCompiledPredicate',
                isCompiled: true,
                originalPredicateName: 'ThereTest',
                definition: {
                  type: 'IntermediateCompiledPredicateDef',
                  name: 'ThereTestT',
                  connective: LogicalConnective.ThereExistsSuchThat,
                  inputDefs: ['ThereTestT'],
                  inputs: [
                    'hint:hint:hint',
                    'a',
                    {
                      type: 'AtomicProposition',
                      predicate: { type: 'AtomicPredicateCall', source: 'Foo' },
                      inputs: [
                        {
                          type: 'VariableInput',
                          placeholder: 'a',
                          children: []
                        }
                      ]
                    }
                  ],
                  propertyInputs: []
                }
              }
            ],
            entryPoint: 'ThereTestT'
          }
        ])
      })
    })
    describe('bind', () => {
      test('bindand', () => {
        const input: PropertyDef[] = [
          {
            name: 'bindAndTest',
            inputDefs: ['a'],
            body: {
              type: 'PropertyNode',
              predicate: 'And',
              inputs: [
                { type: 'PropertyNode', predicate: 'Foo', inputs: ['a.0'] },
                { type: 'PropertyNode', predicate: 'Bar', inputs: ['a.1'] }
              ]
            }
          }
        ]
        const output = createCompiledPredicates(input)
        expect(output).toStrictEqual([
          {
            type: 'CompiledPredicate',
            name: 'BindAndTest',
            inputDefs: ['a'],
            contracts: [
              {
                type: 'IntermediateCompiledPredicate',
                isCompiled: true,
                originalPredicateName: 'BindAndTest',
                definition: {
                  type: 'IntermediateCompiledPredicateDef',
                  name: 'BindAndTestA',
                  connective: LogicalConnective.And,
                  inputDefs: ['BindAndTestA', 'a'],
                  inputs: [
                    {
                      type: 'AtomicProposition',
                      predicate: { type: 'AtomicPredicateCall', source: 'Foo' },
                      inputs: [
                        { type: 'NormalInput', inputIndex: 1, children: [0] }
                      ]
                    },
                    {
                      type: 'AtomicProposition',
                      predicate: { type: 'AtomicPredicateCall', source: 'Bar' },
                      inputs: [
                        { type: 'NormalInput', inputIndex: 1, children: [1] }
                      ]
                    }
                  ],
                  propertyInputs: [
                    { type: 'NormalInput', inputIndex: 1, children: [] }
                  ]
                }
              }
            ],
            entryPoint: 'BindAndTestA'
          }
        ])
      })
      test('bind2', () => {
        const input: PropertyDef[] = [
          {
            name: 'bind2Test',
            inputDefs: ['a'],
            body: {
              type: 'PropertyNode',
              predicate: 'And',
              inputs: [
                { type: 'PropertyNode', predicate: 'Foo', inputs: ['a.0'] },
                { type: 'PropertyNode', predicate: 'Bar', inputs: ['a.1.2'] }
              ]
            }
          }
        ]
        const output = createCompiledPredicates(input)
        expect(output).toStrictEqual([
          {
            type: 'CompiledPredicate',
            name: 'Bind2Test',
            inputDefs: ['a'],
            contracts: [
              {
                type: 'IntermediateCompiledPredicate',
                isCompiled: true,
                originalPredicateName: 'Bind2Test',
                definition: {
                  type: 'IntermediateCompiledPredicateDef',
                  name: 'Bind2TestA',
                  connective: LogicalConnective.And,
                  inputDefs: ['Bind2TestA', 'a'],
                  inputs: [
                    {
                      type: 'AtomicProposition',
                      predicate: { type: 'AtomicPredicateCall', source: 'Foo' },
                      inputs: [
                        { type: 'NormalInput', inputIndex: 1, children: [0] }
                      ]
                    },
                    {
                      type: 'AtomicProposition',
                      predicate: { type: 'AtomicPredicateCall', source: 'Bar' },
                      inputs: [
                        { type: 'NormalInput', inputIndex: 1, children: [1, 2] }
                      ]
                    }
                  ],
                  propertyInputs: [
                    { type: 'NormalInput', inputIndex: 1, children: [1] }
                  ]
                }
              }
            ],
            entryPoint: 'Bind2TestA'
          }
        ])
      })
      test('bindval', () => {
        const input: PropertyDef[] = [
          {
            name: 'bindValTest',
            inputDefs: ['a'],
            body: {
              type: 'PropertyNode',
              predicate: 'ThereExistsSuchThat',
              inputs: [
                { type: 'PropertyNode', predicate: 'B', inputs: [] },
                'b',
                { type: 'PropertyNode', predicate: 'Foo', inputs: ['b.0', 'a'] }
              ]
            }
          }
        ]
        const output = createCompiledPredicates(input)
        expect(output).toStrictEqual([
          {
            type: 'CompiledPredicate',
            name: 'BindValTest',
            inputDefs: ['a'],
            contracts: [
              {
                type: 'IntermediateCompiledPredicate',
                isCompiled: true,
                originalPredicateName: 'BindValTest',
                definition: {
                  type: 'IntermediateCompiledPredicateDef',
                  name: 'BindValTestT',
                  connective: LogicalConnective.ThereExistsSuchThat,
                  inputDefs: ['BindValTestT', 'a'],
                  inputs: [
                    {
                      type: 'AtomicProposition',
                      predicate: { type: 'AtomicPredicateCall', source: 'B' },
                      inputs: []
                    },
                    'b',
                    {
                      type: 'AtomicProposition',
                      predicate: { type: 'AtomicPredicateCall', source: 'Foo' },
                      inputs: [
                        {
                          type: 'VariableInput',
                          placeholder: 'b',
                          children: [0]
                        },
                        { type: 'NormalInput', inputIndex: 1, children: [] }
                      ]
                    }
                  ],
                  propertyInputs: []
                }
              }
            ],
            entryPoint: 'BindValTestT'
          }
        ])
      })

      test('bindaddr', () => {
        const input: PropertyDef[] = [
          {
            name: 'bindAddrTest',
            inputDefs: ['a'],
            body: {
              type: 'PropertyNode',
              predicate: 'And',
              inputs: [
                {
                  type: 'PropertyNode',
                  predicate: 'Equal',
                  inputs: ['a.address', 'self.address']
                },
                { type: 'PropertyNode', predicate: 'Bar', inputs: ['a.0'] }
              ]
            }
          }
        ]
        const output = createCompiledPredicates(input)
        expect(output).toStrictEqual([
          {
            type: 'CompiledPredicate',
            name: 'BindAddrTest',
            inputDefs: ['a'],
            contracts: [
              {
                type: 'IntermediateCompiledPredicate',
                isCompiled: true,
                originalPredicateName: 'BindAddrTest',
                definition: {
                  type: 'IntermediateCompiledPredicateDef',
                  name: 'BindAddrTestA',
                  connective: LogicalConnective.And,
                  inputDefs: ['BindAddrTestA', 'a'],
                  inputs: [
                    {
                      type: 'AtomicProposition',
                      predicate: {
                        type: 'AtomicPredicateCall',
                        source: 'Equal'
                      },
                      inputs: [
                        {
                          type: 'NormalInput',
                          inputIndex: 1,
                          children: [-1]
                        },
                        { type: 'SelfInput', children: [-1] }
                      ]
                    },
                    {
                      type: 'AtomicProposition',
                      predicate: { type: 'AtomicPredicateCall', source: 'Bar' },
                      inputs: [
                        { type: 'NormalInput', inputIndex: 1, children: [0] }
                      ]
                    }
                  ],
                  propertyInputs: [
                    { type: 'NormalInput', inputIndex: 1, children: [] }
                  ]
                }
              }
            ],
            entryPoint: 'BindAddrTestA'
          }
        ])
      })
    })
    describe('variable', () => {
      test('eval1', () => {
        const input: PropertyDef[] = [
          {
            name: 'evalTest',
            inputDefs: ['a', 'b'],
            body: {
              type: 'PropertyNode',
              predicate: 'And',
              inputs: [
                { type: 'PropertyNode', predicate: 'Foo', inputs: ['a'] },
                { type: 'PropertyNode', predicate: 'b', inputs: [] }
              ]
            }
          }
        ]
        const output = createCompiledPredicates(input)
        expect(output).toStrictEqual([
          {
            type: 'CompiledPredicate',
            name: 'EvalTest',
            inputDefs: ['a', 'b'],
            contracts: [
              {
                type: 'IntermediateCompiledPredicate',
                isCompiled: true,
                originalPredicateName: 'EvalTest',
                definition: {
                  type: 'IntermediateCompiledPredicateDef',
                  name: 'EvalTestA',
                  connective: LogicalConnective.And,
                  inputDefs: ['EvalTestA', 'a', 'b'],
                  inputs: [
                    {
                      type: 'AtomicProposition',
                      predicate: { type: 'AtomicPredicateCall', source: 'Foo' },
                      inputs: [
                        { type: 'NormalInput', inputIndex: 1, children: [] }
                      ]
                    },
                    {
                      type: 'AtomicProposition',
                      predicate: {
                        type: 'InputPredicateCall',
                        source: {
                          type: 'NormalInput',
                          inputIndex: 2,
                          children: []
                        }
                      },
                      inputs: []
                    }
                  ],
                  propertyInputs: []
                }
              }
            ],
            entryPoint: 'EvalTestA'
          }
        ])
      })
      test('forval', () => {
        const input: PropertyDef[] = [
          {
            name: 'forValTest',
            inputDefs: ['a'],
            body: {
              type: 'PropertyNode',
              predicate: 'ForAllSuchThat',
              inputs: [
                { type: 'PropertyNode', predicate: 'A', inputs: ['a'] },
                'b',
                { type: 'PropertyNode', predicate: 'b', inputs: [] }
              ]
            }
          }
        ]
        const output = createCompiledPredicates(input)
        expect(output).toStrictEqual([
          {
            type: 'CompiledPredicate',
            name: 'ForValTest',
            inputDefs: ['a'],
            contracts: [
              {
                type: 'IntermediateCompiledPredicate',
                isCompiled: true,
                originalPredicateName: 'ForValTest',
                definition: {
                  type: 'IntermediateCompiledPredicateDef',
                  name: 'ForValTestF',
                  connective: LogicalConnective.ForAllSuchThat,
                  inputDefs: ['ForValTestF', 'a'],
                  inputs: [
                    {
                      type: 'AtomicProposition',
                      predicate: { type: 'AtomicPredicateCall', source: 'A' },
                      inputs: [
                        { type: 'NormalInput', inputIndex: 1, children: [] }
                      ]
                    },
                    'b',
                    {
                      type: 'AtomicProposition',
                      predicate: { type: 'VariablePredicateCall' },
                      inputs: []
                    }
                  ],
                  propertyInputs: []
                }
              }
            ],
            entryPoint: 'ForValTestF'
          }
        ])
      })
      test('thereval', () => {
        const input: PropertyDef[] = [
          {
            name: 'thereValTest',
            inputDefs: [],
            body: {
              type: 'PropertyNode',
              predicate: 'ThereExistsSuchThat',
              inputs: [
                { type: 'PropertyNode', predicate: 'A', inputs: [] },
                'a',
                { type: 'PropertyNode', predicate: 'a', inputs: [] }
              ]
            }
          }
        ]
        const output = createCompiledPredicates(input)
        expect(output).toStrictEqual([
          {
            type: 'CompiledPredicate',
            name: 'ThereValTest',
            inputDefs: [],
            contracts: [
              {
                type: 'IntermediateCompiledPredicate',
                isCompiled: true,
                originalPredicateName: 'ThereValTest',
                definition: {
                  type: 'IntermediateCompiledPredicateDef',
                  name: 'ThereValTestT',
                  connective: LogicalConnective.ThereExistsSuchThat,
                  inputDefs: ['ThereValTestT'],
                  inputs: [
                    {
                      type: 'AtomicProposition',
                      predicate: { type: 'AtomicPredicateCall', source: 'A' },
                      inputs: []
                    },
                    'a',
                    {
                      type: 'AtomicProposition',
                      predicate: { type: 'VariablePredicateCall' },
                      inputs: []
                    }
                  ],
                  propertyInputs: []
                }
              }
            ],
            entryPoint: 'ThereValTestT'
          }
        ])
      })
      test('thereval2', () => {
        const input: PropertyDef[] = [
          {
            name: 'thereValTest',
            inputDefs: ['a'],
            body: {
              type: 'PropertyNode',
              predicate: 'ThereExistsSuchThat',
              inputs: [
                { type: 'PropertyNode', predicate: 'B', inputs: [] },
                'b',
                { type: 'PropertyNode', predicate: 'a', inputs: ['b'] }
              ]
            }
          }
        ]
        const output = createCompiledPredicates(input)
        expect(output).toStrictEqual([
          {
            type: 'CompiledPredicate',
            name: 'ThereValTest',
            inputDefs: ['a'],
            contracts: [
              {
                type: 'IntermediateCompiledPredicate',
                isCompiled: true,
                originalPredicateName: 'ThereValTest',
                definition: {
                  type: 'IntermediateCompiledPredicateDef',
                  name: 'ThereValTestT',
                  connective: LogicalConnective.ThereExistsSuchThat,
                  inputDefs: ['ThereValTestT', 'a'],
                  inputs: [
                    {
                      type: 'AtomicProposition',
                      predicate: { type: 'AtomicPredicateCall', source: 'B' },
                      inputs: []
                    },
                    'b',
                    {
                      type: 'AtomicProposition',
                      predicate: {
                        type: 'InputPredicateCall',
                        source: {
                          type: 'NormalInput',
                          inputIndex: 1,
                          children: []
                        }
                      },
                      inputs: [
                        {
                          type: 'VariableInput',
                          placeholder: 'b',
                          children: []
                        }
                      ]
                    }
                  ],
                  propertyInputs: []
                }
              }
            ],
            entryPoint: 'ThereValTestT'
          }
        ])
      })
    })
  })
})
