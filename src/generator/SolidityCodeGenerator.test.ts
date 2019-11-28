import { SolidityCodeGenerator } from './'
import { CompiledPredicate } from '../transpiler'

describe('SolidityCodeGenerator', () => {
  beforeEach(async () => {})
  describe('generate', () => {
    test('return abstract syntax tree', () => {
      const generator = new SolidityCodeGenerator()
      const input: CompiledPredicate[] = [
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
      ]
      const output = generator.generate(input)
      expect(typeof output).toBe('string')
    })
  })
})
