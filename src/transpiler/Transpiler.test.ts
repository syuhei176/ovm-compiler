import { Transpiler } from './'
import { PropertyDef } from '../parser/PropertyDef'

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
              type: 'IntermediateCompiledPredicate',
              isCompiled: true,
              originalPredicateName: 'Test',
              definition: {
                type: 'IntermediateCompiledPredicateDef',
                name: 'TestFA',
                predicate: 'And',
                inputDefs: ['TestFA', 'b'],
                inputs: [
                  {
                    type: 'AtomicProposition',
                    predicate: { type: 'AtomicPredicate', source: 'Foo' },
                    inputs: [1]
                  },
                  {
                    type: 'AtomicProposition',
                    predicate: { type: 'AtomicPredicate', source: 'Bar' },
                    inputs: [1]
                  }
                ]
              }
            },
            {
              type: 'IntermediateCompiledPredicate',
              isCompiled: true,
              originalPredicateName: 'Test',
              definition: {
                type: 'IntermediateCompiledPredicateDef',
                name: 'TestF',
                predicate: 'ForAllSuchThat',
                inputDefs: ['TestF', 'a'],
                inputs: [
                  {
                    type: 'AtomicProposition',
                    predicate: { type: 'AtomicPredicate', source: 'A' },
                    inputs: [1]
                  },
                  {
                    type: 'AtomicProposition',
                    predicate: { type: 'AtomicPredicate', source: 'TestFA' },
                    inputs: [-1, -1]
                  }
                ]
              }
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
                predicate: 'Equal',
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
                predicate: 'ThereExistsSuchThat',
                inputDefs: ['ChildEqT', 'a'],
                inputs: [
                  {
                    type: 'AtomicProposition',
                    predicate: { type: 'AtomicPredicate', source: 'Bytes' },
                    inputs: []
                  },
                  {
                    type: 'AtomicProposition',
                    predicate: { type: 'AtomicPredicate', source: 'Equal' },
                    inputs: [[-1, 0], 1]
                  }
                ]
              }
            }
          ]
        }
      ])
    })

    test('variable', () => {
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

      const output = Transpiler.calculateInteractiveNodes(input)

      expect(output).toEqual([
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
                    inputs: [1]
                  },
                  {
                    type: 'AtomicProposition',
                    predicate: { type: 'InputPredicate', source: 2 },
                    inputs: []
                  }
                ]
              }
            }
          ]
        }
      ])
    })

    test('variable: eval2', () => {
      const input: PropertyDef[] = [
        {
          name: 'evalTest',
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

      const output = Transpiler.calculateInteractiveNodes(input)

      expect(output).toEqual([
        {
          type: 'CompiledPredicate',
          name: 'EvalTest',
          inputDefs: [],
          contracts: [
            {
              type: 'IntermediateCompiledPredicate',
              isCompiled: true,
              originalPredicateName: 'EvalTest',
              definition: {
                type: 'IntermediateCompiledPredicateDef',
                name: 'EvalTestT',
                predicate: 'ThereExistsSuchThat',
                inputDefs: ['EvalTestT'],
                inputs: [
                  {
                    type: 'AtomicProposition',
                    predicate: { type: 'AtomicPredicate', source: 'A' },
                    inputs: []
                  },
                  {
                    type: 'AtomicProposition',
                    predicate: { type: 'VariablePredicate' },
                    inputs: []
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
