import { SolidityCodeGenerator } from './'
import { CompiledPredicate, IntermediateCompiledPredicate } from '../transpiler'
import fs from 'fs'
import path from 'path'

const doWrite = true
function readFile(filePath: string, output: string) {
  if (doWrite) {
    fs.writeFileSync(path.join(__dirname, filePath), output)
  }
  return fs.readFileSync(path.join(__dirname, filePath))
}

describe('SolidityCodeGenerator', () => {
  const generator = new SolidityCodeGenerator()
  beforeEach(async () => {})

  describe('operator', () => {
    test('and', () => {
      const input: CompiledPredicate[] = [
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
          ],
          entryPoint: 'AndTestA'
        }
      ]
      const output = generator.generate(input)
      const testOutput = readFile(
        '../../examples/testcases/operators/TestAnd.sol',
        output
      )
      expect(output).toBe(testOutput.toString())
    })
    test('or', () => {
      const input: CompiledPredicate[] = [
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
          ],
          entryPoint: 'OrTestO'
        }
      ]
      const output = generator.generate(input)
      const testOutput = readFile(
        '../../examples/testcases/operators/TestOr.sol',
        output
      )
      expect(output).toBe(testOutput.toString())
    })
    test('not', () => {
      const input: CompiledPredicate[] = [
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
          ],
          entryPoint: 'NotTestN'
        }
      ]
      const output = generator.generate(input)
      const testOutput = readFile(
        '../../examples/testcases/operators/TestNot.sol',
        output
      )
      expect(output).toBe(testOutput.toString())
    })
    test('forall', () => {
      const input: CompiledPredicate[] = [
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
          ],
          entryPoint: 'ForallTestF'
        }
      ]
      const output = generator.generate(input)
      const testOutput = readFile(
        '../../examples/testcases/operators/TestForall.sol',
        output
      )
      expect(output).toBe(testOutput.toString())
    })
    test('there', () => {
      const input: CompiledPredicate[] = [
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
                  'hint:hint:hint',
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
          ],
          entryPoint: 'ThereTestT'
        }
      ]
      const output = generator.generate(input)
      const testOutput = readFile(
        '../../examples/testcases/operators/TestThere.sol',
        output
      )
      expect(output).toBe(testOutput.toString())
    })
  })

  describe('bind', () => {
    test('bindand', () => {
      const input: IntermediateCompiledPredicate = {
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
              inputs: [{ type: 'NormalInput', inputIndex: 1, children: [0] }]
            },
            {
              type: 'AtomicProposition',
              predicate: { type: 'AtomicPredicate', source: 'Bar' },
              inputs: [{ type: 'NormalInput', inputIndex: 1, children: [1] }]
            }
          ],
          propertyInputs: [{ type: 'NormalInput', inputIndex: 1, children: [] }]
        }
      }
      const outputOfGetChild = generator.includeCallback('getChild', {
        property: input
      })
      const outputOfDecide = generator.includeCallback('decide', {
        property: input
      })
      const testOutputOfGetChild = readFile(
        '../../examples/testcases/bind/BindAndGetChild.sol',
        outputOfGetChild
      )
      const testOutputOfDecide = readFile(
        '../../examples/testcases/bind/BindAndDecide.sol',
        outputOfDecide
      )
      expect(outputOfGetChild).toBe(testOutputOfGetChild.toString())
      expect(outputOfDecide).toBe(testOutputOfDecide.toString())
    })

    test('bind2', () => {
      const input: IntermediateCompiledPredicate = {
        type: 'IntermediateCompiledPredicate',
        isCompiled: true,
        originalPredicateName: 'Bind2Test',
        definition: {
          type: 'IntermediateCompiledPredicateDef',
          name: 'Bind2TestA',
          predicate: 'And',
          inputDefs: ['Bind2TestA', 'a'],
          inputs: [
            {
              type: 'AtomicProposition',
              predicate: { type: 'AtomicPredicate', source: 'Foo' },
              inputs: [{ type: 'NormalInput', inputIndex: 1, children: [0] }]
            },
            {
              type: 'AtomicProposition',
              predicate: { type: 'AtomicPredicate', source: 'Bar' },
              inputs: [{ type: 'NormalInput', inputIndex: 1, children: [1, 2] }]
            }
          ],
          propertyInputs: [
            { type: 'NormalInput', inputIndex: 1, children: [1] }
          ]
        }
      }
      const output = generator.includeCallback('getChild', { property: input })
      const testOutput = readFile(
        '../../examples/testcases/bind/Bind2.sol',
        output
      )
      expect(output).toBe(testOutput.toString())
    })

    test('bindval', () => {
      const input: IntermediateCompiledPredicate = {
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
      const output = generator.includeCallback('getChild', { property: input })
      const testOutput = readFile(
        '../../examples/testcases/bind/BindVal.sol',
        output
      )
      expect(output).toBe(testOutput.toString())
    })

    test('bindaddr', () => {
      const input: IntermediateCompiledPredicate = {
        type: 'IntermediateCompiledPredicate',
        isCompiled: true,
        originalPredicateName: 'BindAddrTest',
        definition: {
          type: 'IntermediateCompiledPredicateDef',
          name: 'BindAddrTestA',
          predicate: 'And',
          inputDefs: ['BindAddrTestA', 'a'],
          inputs: [
            {
              type: 'AtomicProposition',
              predicate: { type: 'AtomicPredicate', source: 'Equal' },
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
              predicate: { type: 'AtomicPredicate', source: 'Bar' },
              inputs: [{ type: 'NormalInput', inputIndex: 1, children: [0] }]
            }
          ],
          propertyInputs: [{ type: 'NormalInput', inputIndex: 1, children: [] }]
        }
      }
      const output = generator.includeCallback('getChild', { property: input })
      const testOutput = readFile(
        '../../examples/testcases/bind/BindAddr.sol',
        output
      )
      expect(output).toBe(testOutput.toString())
    })
  })

  describe('variable', () => {
    test('eval1', () => {
      const input: IntermediateCompiledPredicate = {
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
              inputs: [{ type: 'NormalInput', inputIndex: 1, children: [] }]
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
      const outputOfGetChild = generator.includeCallback('getChild', {
        property: input
      })
      const outputOfDecide = generator.includeCallback('decide', {
        property: input
      })
      const testOutputOfGetChild = readFile(
        '../../examples/testcases/variable/EvalGetChild.sol',
        outputOfGetChild
      )
      const testOutputOfDecide = readFile(
        '../../examples/testcases/variable/EvalDecide.sol',
        outputOfDecide
      )
      expect(outputOfGetChild).toBe(testOutputOfGetChild.toString())
      expect(outputOfDecide).toBe(testOutputOfDecide.toString())
    })
    test('forval', () => {
      const input: IntermediateCompiledPredicate = {
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
              inputs: [{ type: 'NormalInput', inputIndex: 1, children: [] }]
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
      const outputOfGetChild = generator.includeCallback('getChild', {
        property: input
      })
      const testOutputOfGetChild = readFile(
        '../../examples/testcases/variable/ForValGetChild.sol',
        outputOfGetChild
      )
      expect(outputOfGetChild).toBe(testOutputOfGetChild.toString())
    })
    test('thereval', () => {
      const input: IntermediateCompiledPredicate = {
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
      const outputOfGetChild = generator.includeCallback('getChild', {
        property: input
      })
      const outputOfDecide = generator.includeCallback('decide', {
        property: input
      })
      const testOutputOfGetChild = readFile(
        '../../examples/testcases/variable/ThereValGetChild.sol',
        outputOfGetChild
      )
      const testOutputOfDecide = readFile(
        '../../examples/testcases/variable/ThereValDecide.sol',
        outputOfDecide
      )
      expect(outputOfGetChild).toBe(testOutputOfGetChild.toString())
      expect(outputOfDecide).toBe(testOutputOfDecide.toString())
    })
    test('thereval2', () => {
      const input: IntermediateCompiledPredicate = {
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
      const outputOfGetChild = generator.includeCallback('getChild', {
        property: input
      })
      const outputOfDecide = generator.includeCallback('decide', {
        property: input
      })
      const testOutputOfGetChild = readFile(
        '../../examples/testcases/variable/ThereVal2GetChild.sol',
        outputOfGetChild
      )
      const testOutputOfDecide = readFile(
        '../../examples/testcases/variable/ThereVal2Decide.sol',
        outputOfDecide
      )
      expect(outputOfGetChild).toBe(testOutputOfGetChild.toString())
      expect(outputOfDecide).toBe(testOutputOfDecide.toString())
    })
  })
})
