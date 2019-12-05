import { SolidityCodeGenerator } from './'
import { CompiledPredicate } from '../transpiler'
import fs from 'fs'
import path from 'path'

describe('SolidityCodeGenerator', () => {
  beforeEach(async () => {})
  describe('generate', () => {
    test('return generated code', () => {
      const generator = new SolidityCodeGenerator()
      const input: CompiledPredicate[] = [
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
                    inputs: [
                      { type: 'NormalInput', inputIndex: 1, children: [] }
                    ]
                  },
                  {
                    type: 'AtomicProposition',
                    predicate: { type: 'AtomicPredicate', source: 'Bar' },
                    inputs: [
                      { type: 'NormalInput', inputIndex: 1, children: [] }
                    ]
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
                    inputs: [
                      { type: 'NormalInput', inputIndex: 1, children: [] }
                    ]
                  },
                  {
                    type: 'AtomicProposition',
                    predicate: { type: 'AtomicPredicate', source: 'TestFA' },
                    inputs: [
                      {
                        type: 'VariableInput',
                        placeholder: 'TestFA',
                        children: []
                      },
                      { type: 'VariableInput', placeholder: 'b', children: [] }
                    ]
                  }
                ]
              }
            }
          ]
        }
      ]
      const output = generator.generate(input)
      /*
      fs.writeFileSync(
        path.join(__dirname, '../../examples/testcases/forall/Test.sol'),
        output
      )
      */
      const testOutput = fs.readFileSync(
        path.join(__dirname, '../../examples/testcases/forall/Test.sol')
      )
      expect(output).toBe(testOutput.toString())
    })
    test('return generated code', () => {
      const generator = new SolidityCodeGenerator()
      const input: CompiledPredicate[] = [
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
                    inputs: [
                      {
                        type: 'VariableInput',
                        placeholder: 'b',
                        children: [0]
                      },
                      { type: 'NormalInput', inputIndex: 1, children: [] }
                    ]
                  }
                ]
              }
            }
          ]
        }
      ]
      const output = generator.generate(input)
      /*
      fs.writeFileSync(
        path.join(__dirname, '../../examples/testcases/bind/ChildEq.sol'),
        output
      )
      */
      const testOutput = fs.readFileSync(
        path.join(__dirname, '../../examples/testcases/bind/ChildEq.sol')
      )
      expect(output).toBe(testOutput.toString())
    })

    test('variable', () => {
      const generator = new SolidityCodeGenerator()
      const input: CompiledPredicate[] = [
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
                      {
                        type: 'NormalInput',
                        inputIndex: 1,
                        children: []
                      }
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
                ]
              }
            }
          ]
        }
      ]
      const output = generator.generate(input)
      /*
      fs.writeFileSync(
        path.join(__dirname, '../../examples/testcases/variable/Eval1.sol'),
        output
      )
      */
      const testOutput = fs.readFileSync(
        path.join(__dirname, '../../examples/testcases/variable/Eval1.sol')
      )
      expect(output).toBe(testOutput.toString())
    })

    test('variable: eval2', () => {
      const generator = new SolidityCodeGenerator()
      const input: CompiledPredicate[] = [
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
      ]
      const output = generator.generate(input)
      const testOutput = fs.readFileSync(
        path.join(__dirname, '../../examples/testcases/variable/Eval2.sol')
      )
      expect(output).toBe(testOutput.toString())
    })
  })
})
