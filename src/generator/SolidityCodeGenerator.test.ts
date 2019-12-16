import { SolidityCodeGenerator } from './'
import { CompiledPredicate, IntermediateCompiledPredicate } from '../transpiler'
import fs from 'fs'
import path from 'path'

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
          ]
        }
      ]
      const output = generator.generate(input)
      const testOutput = fs.readFileSync(
        path.join(__dirname, '../../examples/testcases/operators/TestAnd.sol')
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
          ]
        }
      ]
      const output = generator.generate(input)
      const testOutput = fs.readFileSync(
        path.join(__dirname, '../../examples/testcases/operators/TestOr.sol')
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
          ]
        }
      ]
      const output = generator.generate(input)
      const testOutput = fs.readFileSync(
        path.join(__dirname, '../../examples/testcases/operators/TestNot.sol')
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
          ]
        }
      ]
      const output = generator.generate(input)
      const testOutput = fs.readFileSync(
        path.join(
          __dirname,
          '../../examples/testcases/operators/TestForall.sol'
        )
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
          ]
        }
      ]
      const output = generator.generate(input)
      const testOutput = fs.readFileSync(
        path.join(__dirname, '../../examples/testcases/operators/TestThere.sol')
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
      const testOutputOfGetChild = fs.readFileSync(
        path.join(
          __dirname,
          '../../examples/testcases/bind/BindAndGetChild.sol'
        )
      )
      const testOutputOfDecide = fs.readFileSync(
        path.join(__dirname, '../../examples/testcases/bind/BindAndDecide.sol')
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
      const testOutput = fs.readFileSync(
        path.join(__dirname, '../../examples/testcases/bind/Bind2.sol')
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
      const testOutput = fs.readFileSync(
        path.join(__dirname, '../../examples/testcases/bind/BindVal.sol')
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
      const testOutput = fs.readFileSync(
        path.join(__dirname, '../../examples/testcases/bind/BindAddr.sol')
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
      const testOutputOfGetChild = fs.readFileSync(
        path.join(
          __dirname,
          '../../examples/testcases/variable/EvalGetChild.sol'
        )
      )
      const testOutputOfDecide = fs.readFileSync(
        path.join(__dirname, '../../examples/testcases/variable/EvalDecide.sol')
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
      const testOutputOfGetChild = fs.readFileSync(
        path.join(
          __dirname,
          '../../examples/testcases/variable/ForValGetChild.sol'
        )
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
      const testOutputOfGetChild = fs.readFileSync(
        path.join(
          __dirname,
          '../../examples/testcases/variable/ThereValGetChild.sol'
        )
      )
      const testOutputOfDecide = fs.readFileSync(
        path.join(
          __dirname,
          '../../examples/testcases/variable/ThereValDecide.sol'
        )
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
      const testOutputOfGetChild = fs.readFileSync(
        path.join(
          __dirname,
          '../../examples/testcases/variable/ThereVal2GetChild.sol'
        )
      )
      const testOutputOfDecide = fs.readFileSync(
        path.join(
          __dirname,
          '../../examples/testcases/variable/ThereVal2Decide.sol'
        )
      )
      expect(outputOfGetChild).toBe(testOutputOfGetChild.toString())
      expect(outputOfDecide).toBe(testOutputOfDecide.toString())
    })
  })
})
