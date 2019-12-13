import { createCompiledPredicates } from './'
import { PropertyDef } from '../parser/PropertyDef'

describe('Transpiler', () => {
  beforeEach(async () => {})
  describe('calculateInteractiveNodes', () => {
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
                  predicate: 'And',
                  inputDefs: ['AndTestA', 'a', 'b'],
                  inputs: [
                    {
                      type: 'AtomicProposition',
                      predicate: { type: 'AtomicPredicate', source: 'Foo' },
                      inputs: [
                        { type: 'NormalInput', inputIndex: 1, children: [] }
                      ]
                    },
                    {
                      type: 'AtomicProposition',
                      predicate: { type: 'AtomicPredicate', source: 'Bar' },
                      inputs: [
                        { type: 'NormalInput', inputIndex: 2, children: [] }
                      ]
                    }
                  ],
                  propertyInputs: []
                }
              }
            ]
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
                  predicate: 'Or',
                  inputDefs: ['OrTestO', 'a', 'b'],
                  inputs: [
                    {
                      type: 'AtomicProposition',
                      predicate: { type: 'AtomicPredicate', source: 'Foo' },
                      inputs: [
                        { type: 'NormalInput', inputIndex: 1, children: [] }
                      ]
                    },
                    {
                      type: 'AtomicProposition',
                      predicate: { type: 'AtomicPredicate', source: 'Bar' },
                      inputs: [
                        { type: 'NormalInput', inputIndex: 2, children: [] }
                      ]
                    }
                  ],
                  propertyInputs: []
                }
              }
            ]
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
                  predicate: 'Not',
                  inputDefs: ['NotTestN', 'a'],
                  inputs: [
                    {
                      type: 'AtomicProposition',
                      predicate: { type: 'AtomicPredicate', source: 'Foo' },
                      inputs: [
                        { type: 'NormalInput', inputIndex: 1, children: [] }
                      ]
                    }
                  ],
                  propertyInputs: []
                }
              }
            ]
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
                  predicate: 'ForAllSuchThat',
                  inputDefs: ['ForallTestF', 'a'],
                  inputs: [
                    {
                      type: 'AtomicProposition',
                      predicate: { type: 'AtomicPredicate', source: 'A' },
                      inputs: [
                        { type: 'NormalInput', inputIndex: 1, children: [] }
                      ]
                    },
                    'b',
                    {
                      type: 'AtomicProposition',
                      predicate: { type: 'AtomicPredicate', source: 'Foo' },
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
            ]
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
                { type: 'PropertyNode', predicate: 'A', inputs: [] },
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
                  predicate: 'ThereExistsSuchThat',
                  inputDefs: ['ThereTestT'],
                  inputs: [
                    {
                      type: 'AtomicProposition',
                      predicate: { type: 'AtomicPredicate', source: 'A' },
                      inputs: []
                    },
                    'a',
                    {
                      type: 'AtomicProposition',
                      predicate: { type: 'AtomicPredicate', source: 'Foo' },
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
            ]
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
                  predicate: 'And',
                  inputDefs: ['BindAndTestA', 'a'],
                  inputs: [
                    {
                      type: 'AtomicProposition',
                      predicate: { type: 'AtomicPredicate', source: 'Foo' },
                      inputs: [
                        { type: 'NormalInput', inputIndex: 1, children: [0] }
                      ]
                    },
                    {
                      type: 'AtomicProposition',
                      predicate: { type: 'AtomicPredicate', source: 'Bar' },
                      inputs: [
                        { type: 'NormalInput', inputIndex: 1, children: [1] }
                      ]
                    }
                  ],
                  propertyInputs: [1]
                }
              }
            ]
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
                { type: 'PropertyNode', predicate: 'Bytes', inputs: [] },
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
                  predicate: 'ThereExistsSuchThat',
                  inputDefs: ['BindValTestT', 'a'],
                  inputs: [
                    {
                      type: 'AtomicProposition',
                      predicate: { type: 'AtomicPredicate', source: 'Bytes' },
                      inputs: []
                    },
                    'b',
                    {
                      type: 'AtomicProposition',
                      predicate: { type: 'AtomicPredicate', source: 'Foo' },
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
            ]
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
                  predicate: 'And',
                  inputDefs: ['EvalTestA', 'a', 'b'],
                  inputs: [
                    {
                      type: 'AtomicProposition',
                      predicate: { type: 'AtomicPredicate', source: 'Foo' },
                      inputs: [
                        { type: 'NormalInput', inputIndex: 1, children: [] }
                      ]
                    },
                    {
                      type: 'AtomicProposition',
                      predicate: {
                        type: 'InputPredicate',
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
            ]
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
                  predicate: 'ForAllSuchThat',
                  inputDefs: ['ForValTestF', 'a'],
                  inputs: [
                    {
                      type: 'AtomicProposition',
                      predicate: { type: 'AtomicPredicate', source: 'A' },
                      inputs: [
                        { type: 'NormalInput', inputIndex: 1, children: [] }
                      ]
                    },
                    'b',
                    {
                      type: 'AtomicProposition',
                      predicate: { type: 'VariablePredicate' },
                      inputs: []
                    }
                  ],
                  propertyInputs: []
                }
              }
            ]
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
                  predicate: 'ThereExistsSuchThat',
                  inputDefs: ['ThereValTestT'],
                  inputs: [
                    {
                      type: 'AtomicProposition',
                      predicate: { type: 'AtomicPredicate', source: 'A' },
                      inputs: []
                    },
                    'a',
                    {
                      type: 'AtomicProposition',
                      predicate: { type: 'VariablePredicate' },
                      inputs: []
                    }
                  ],
                  propertyInputs: []
                }
              }
            ]
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
                  predicate: 'ThereExistsSuchThat',
                  inputDefs: ['ThereValTestT', 'a'],
                  inputs: [
                    {
                      type: 'AtomicProposition',
                      predicate: { type: 'AtomicPredicate', source: 'B' },
                      inputs: []
                    },
                    'b',
                    {
                      type: 'AtomicProposition',
                      predicate: {
                        type: 'InputPredicate',
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
            ]
          }
        ])
      })
    })
  })
})
