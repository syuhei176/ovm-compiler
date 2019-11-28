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
                body: {
                  inputs: [
                    { inputs: ['b'], predicate: 'Foo', type: 'PropertyNode' },
                    { inputs: ['b'], predicate: 'Bar', type: 'PropertyNode' }
                  ],
                  predicate: 'And',
                  type: 'PropertyNode'
                },
                inputDefs: ['TestFA', 'b'],
                name: 'TestFA'
              },
              inputs: [-1, -1],
              isCompiled: true,
              originalPredicateName: 'Test',
              type: 'IntermediateCompiledPredicate'
            },
            {
              definition: {
                body: {
                  inputs: [
                    { inputs: ['a'], predicate: 'A', type: 'PropertyNode' },
                    undefined,
                    {
                      inputs: ['TestFA', 'b'],
                      isCompiled: true,
                      predicate: 'TestFA',
                      type: 'PropertyNode'
                    }
                  ],
                  predicate: 'ForAllSuchThat',
                  type: 'PropertyNode'
                },
                inputDefs: ['TestF', 'a'],
                name: 'TestF'
              },
              inputs: [-1, 0],
              isCompiled: true,
              originalPredicateName: 'Test',
              type: 'IntermediateCompiledPredicate'
            }
          ]
        }
      ])
    })
  })
})
