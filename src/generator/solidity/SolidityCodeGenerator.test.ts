import { SolidityCodeGenerator } from './'
import {
  CompiledPredicate,
  IntermediateCompiledPredicate,
  LogicalConnective,
  CompiledInput
} from '../../transpiler'
import fs from 'fs'
import path from 'path'

const doWrite = false
const testcasePath = '../../../examples/testcases'
function readFile(filePath: string, output: string) {
  if (doWrite) {
    fs.writeFileSync(path.join(__dirname, testcasePath, filePath), output)
  }
  return fs.readFileSync(path.join(__dirname, testcasePath, filePath))
}

describe('SolidityCodeGenerator', () => {
  const generator = new SolidityCodeGenerator()
  beforeEach(async () => {})

  describe('operator', () => {
    test('and', async () => {
      const input: CompiledPredicate[] = [
        {
          type: 'CompiledPredicate',
          name: 'AndTest',
          inputDefs: ['a', 'b'],
          contracts: [
            {
              type: 'IntermediateCompiledPredicate',
              originalPredicateName: 'AndTest',
              name: 'AndTestA',
              connective: LogicalConnective.And,
              inputDefs: ['AndTestA', 'a', 'b'],
              inputs: [
                {
                  type: 'AtomicProposition',
                  predicate: { type: 'AtomicPredicateCall', source: 'Foo' },
                  inputs: [{ type: 'NormalInput', inputIndex: 1, children: [] }]
                },
                {
                  type: 'AtomicProposition',
                  predicate: { type: 'AtomicPredicateCall', source: 'Bar' },
                  inputs: [{ type: 'NormalInput', inputIndex: 2, children: [] }]
                }
              ],
              propertyInputs: []
            }
          ],
          entryPoint: 'AndTestA'
        }
      ]
      const output = await generator.generate(input)
      const testOutput = readFile('operators/TestAnd.sol', output)
      expect(output).toBe(testOutput.toString())
    })
    test('or', async () => {
      const input: CompiledPredicate[] = [
        {
          type: 'CompiledPredicate',
          name: 'OrTest',
          inputDefs: ['a', 'b'],
          contracts: [
            {
              type: 'IntermediateCompiledPredicate',
              originalPredicateName: 'OrTest',
              name: 'OrTestO',
              connective: LogicalConnective.Or,
              inputDefs: ['OrTestO', 'a', 'b'],
              inputs: [
                {
                  type: 'AtomicProposition',
                  predicate: { type: 'AtomicPredicateCall', source: 'Foo' },
                  inputs: [{ type: 'NormalInput', inputIndex: 1, children: [] }]
                },
                {
                  type: 'AtomicProposition',
                  predicate: { type: 'AtomicPredicateCall', source: 'Bar' },
                  inputs: [{ type: 'NormalInput', inputIndex: 2, children: [] }]
                }
              ],
              propertyInputs: []
            }
          ],
          entryPoint: 'OrTestO'
        }
      ]
      const output = await generator.generate(input)
      const testOutput = readFile('operators/TestOr.sol', output)
      expect(output).toBe(testOutput.toString())
    })
    test('not', async () => {
      const input: CompiledPredicate[] = [
        {
          type: 'CompiledPredicate',
          name: 'NotTest',
          inputDefs: ['a'],
          contracts: [
            {
              type: 'IntermediateCompiledPredicate',
              originalPredicateName: 'NotTest',
              name: 'NotTestN',
              connective: LogicalConnective.Not,
              inputDefs: ['NotTestN', 'a'],
              inputs: [
                {
                  type: 'AtomicProposition',
                  predicate: { type: 'AtomicPredicateCall', source: 'Foo' },
                  inputs: [{ type: 'NormalInput', inputIndex: 1, children: [] }]
                }
              ],
              propertyInputs: []
            }
          ],
          entryPoint: 'NotTestN'
        }
      ]
      const output = await generator.generate(input)
      const testOutput = readFile('operators/TestNot.sol', output)
      expect(output).toBe(testOutput.toString())
    })
    test('forall', async () => {
      const input: CompiledPredicate[] = [
        {
          type: 'CompiledPredicate',
          name: 'ForallTest',
          inputDefs: ['a'],
          contracts: [
            {
              type: 'IntermediateCompiledPredicate',
              originalPredicateName: 'ForallTest',
              name: 'ForallTestF',
              connective: LogicalConnective.ForAllSuchThat,
              inputDefs: ['ForallTestF', 'a'],
              inputs: [
                {
                  type: 'AtomicProposition',
                  predicate: { type: 'AtomicPredicateCall', source: 'A' },
                  inputs: [{ type: 'NormalInput', inputIndex: 1, children: [] }]
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
          ],
          entryPoint: 'ForallTestF'
        }
      ]
      const output = await generator.generate(input)
      const testOutput = readFile('operators/TestForall.sol', output)
      expect(output).toBe(testOutput.toString())
    })
    test('there', async () => {
      const input: CompiledPredicate[] = [
        {
          type: 'CompiledPredicate',
          name: 'ThereTest',
          inputDefs: [],
          contracts: [
            {
              type: 'IntermediateCompiledPredicate',
              originalPredicateName: 'ThereTest',
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
          ],
          entryPoint: 'ThereTestT'
        }
      ]
      const output = await generator.generate(input)
      const testOutput = readFile('operators/TestThere.sol', output)
      expect(output).toBe(testOutput.toString())
    })
  })

  describe('bind', () => {
    test('bindand', async () => {
      const input: IntermediateCompiledPredicate = {
        type: 'IntermediateCompiledPredicate',
        originalPredicateName: 'BindAndTest',
        name: 'BindAndTestA',
        connective: LogicalConnective.And,
        inputDefs: ['BindAndTestA', 'a'],
        inputs: [
          {
            type: 'AtomicProposition',
            predicate: { type: 'AtomicPredicateCall', source: 'Foo' },
            inputs: [{ type: 'NormalInput', inputIndex: 1, children: [0] }]
          },
          {
            type: 'AtomicProposition',
            predicate: { type: 'AtomicPredicateCall', source: 'Bar' },
            inputs: [{ type: 'NormalInput', inputIndex: 1, children: [1] }]
          }
        ],
        propertyInputs: [{ type: 'NormalInput', inputIndex: 1, children: [] }]
      }
      const outputOfGetChild = generator.includeCallback('getChild', {
        property: input
      })
      const outputOfDecide = generator.includeCallback('decide', {
        property: input
      })
      const testOutputOfGetChild = readFile(
        'bind/BindAndGetChild.sol',
        outputOfGetChild
      )
      const testOutputOfDecide = readFile(
        'bind/BindAndDecide.sol',
        outputOfDecide
      )
      expect(outputOfGetChild).toBe(testOutputOfGetChild.toString())
      expect(outputOfDecide).toBe(testOutputOfDecide.toString())
    })

    test('bind2', async () => {
      const input: IntermediateCompiledPredicate = {
        type: 'IntermediateCompiledPredicate',
        originalPredicateName: 'Bind2Test',
        name: 'Bind2TestA',
        connective: LogicalConnective.And,
        inputDefs: ['Bind2TestA', 'a'],
        inputs: [
          {
            type: 'AtomicProposition',
            predicate: { type: 'AtomicPredicateCall', source: 'Foo' },
            inputs: [{ type: 'NormalInput', inputIndex: 1, children: [0] }]
          },
          {
            type: 'AtomicProposition',
            predicate: { type: 'AtomicPredicateCall', source: 'Bar' },
            inputs: [{ type: 'NormalInput', inputIndex: 1, children: [1, 2] }]
          }
        ],
        propertyInputs: [{ type: 'NormalInput', inputIndex: 1, children: [1] }]
      }
      const output = generator.includeCallback('getChild', { property: input })
      const testOutput = readFile('bind/Bind2.sol', output)
      expect(output).toBe(testOutput.toString())
    })

    test('bindval', async () => {
      const input: IntermediateCompiledPredicate = {
        type: 'IntermediateCompiledPredicate',
        originalPredicateName: 'BindValTest',
        name: 'BindValTestT',
        connective: LogicalConnective.ThereExistsSuchThat,
        inputDefs: ['BindValTestT', 'a'],
        inputs: [
          {
            type: 'AtomicProposition',
            predicate: { type: 'AtomicPredicateCall', source: 'Bytes' },
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
      const output = generator.includeCallback('getChild', { property: input })
      const testOutput = readFile('bind/BindVal.sol', output)
      expect(output).toBe(testOutput.toString())
    })

    test('bindaddr', async () => {
      const input: IntermediateCompiledPredicate = {
        type: 'IntermediateCompiledPredicate',
        originalPredicateName: 'BindAddrTest',
        name: 'BindAddrTestA',
        connective: LogicalConnective.And,
        inputDefs: ['BindAddrTestA', 'a'],
        inputs: [
          {
            type: 'AtomicProposition',
            predicate: { type: 'AtomicPredicateCall', source: 'Equal' },
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
            inputs: [{ type: 'NormalInput', inputIndex: 1, children: [0] }]
          }
        ],
        propertyInputs: [{ type: 'NormalInput', inputIndex: 1, children: [] }]
      }
      const output = generator.includeCallback('getChild', { property: input })
      const testOutput = readFile('bind/BindAddr.sol', output)
      expect(output).toBe(testOutput.toString())
    })
  })

  describe('variable', () => {
    test('eval1', async () => {
      const input: IntermediateCompiledPredicate = {
        type: 'IntermediateCompiledPredicate',
        originalPredicateName: 'EvalTest',
        name: 'EvalTestA',
        connective: LogicalConnective.And,
        inputDefs: ['EvalTestA', 'a', 'b'],
        inputs: [
          {
            type: 'AtomicProposition',
            predicate: { type: 'AtomicPredicateCall', source: 'Foo' },
            inputs: [{ type: 'NormalInput', inputIndex: 1, children: [] }]
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
      const outputOfGetChild = generator.includeCallback('getChild', {
        property: input
      })
      const outputOfDecide = generator.includeCallback('decide', {
        property: input
      })
      const testOutputOfGetChild = readFile(
        'variable/EvalGetChild.sol',
        outputOfGetChild
      )
      const testOutputOfDecide = readFile(
        'variable/EvalDecide.sol',
        outputOfDecide
      )
      expect(outputOfGetChild).toBe(testOutputOfGetChild.toString())
      expect(outputOfDecide).toBe(testOutputOfDecide.toString())
    })
    test('forval', async () => {
      const input: IntermediateCompiledPredicate = {
        type: 'IntermediateCompiledPredicate',
        originalPredicateName: 'ForValTest',
        name: 'ForValTestF',
        connective: LogicalConnective.ForAllSuchThat,
        inputDefs: ['ForValTestF', 'a'],
        inputs: [
          {
            type: 'AtomicProposition',
            predicate: { type: 'AtomicPredicateCall', source: 'A' },
            inputs: [{ type: 'NormalInput', inputIndex: 1, children: [] }]
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
      const outputOfGetChild = generator.includeCallback('getChild', {
        property: input
      })
      const testOutputOfGetChild = readFile(
        'variable/ForValGetChild.sol',
        outputOfGetChild
      )
      expect(outputOfGetChild).toBe(testOutputOfGetChild.toString())
    })
    test('thereval', async () => {
      const input: IntermediateCompiledPredicate = {
        type: 'IntermediateCompiledPredicate',
        originalPredicateName: 'ThereValTest',
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
      const outputOfGetChild = generator.includeCallback('getChild', {
        property: input
      })
      const outputOfDecide = generator.includeCallback('decide', {
        property: input
      })
      const testOutputOfGetChild = readFile(
        'variable/ThereValGetChild.sol',
        outputOfGetChild
      )
      const testOutputOfDecide = readFile(
        'variable/ThereValDecide.sol',
        outputOfDecide
      )
      expect(outputOfGetChild).toBe(testOutputOfGetChild.toString())
      expect(outputOfDecide).toBe(testOutputOfDecide.toString())
    })
    test('thereval2', async () => {
      const input: IntermediateCompiledPredicate = {
        type: 'IntermediateCompiledPredicate',
        originalPredicateName: 'ThereValTest',
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
      const outputOfGetChild = generator.includeCallback('getChild', {
        property: input
      })
      const outputOfDecide = generator.includeCallback('decide', {
        property: input
      })
      const testOutputOfGetChild = readFile(
        'variable/ThereVal2GetChild.sol',
        outputOfGetChild
      )
      const testOutputOfDecide = readFile(
        'variable/ThereVal2Decide.sol',
        outputOfDecide
      )
      expect(outputOfGetChild).toBe(testOutputOfGetChild.toString())
      expect(outputOfDecide).toBe(testOutputOfDecide.toString())
    })
  })

  describe('constructInput', () => {
    test('ConstantInput', async () => {
      const input: CompiledInput = {
        type: 'ConstantInput',
        name: 'aaa'
      }
      const output = generator.includeCallback('constructInput', {
        input: input,
        valName: 'items',
        index: 0
      })
      expect(output).toBe('        items[0] = utils.prefixConstant(aaa);\n')
    })

    test('NormalInput', async () => {
      const input: CompiledInput = {
        type: 'NormalInput',
        inputIndex: 1,
        children: []
      }
      const output = generator.includeCallback('constructInput', {
        input: input,
        valName: 'items',
        index: 1
      })
      expect(output).toBe('        items[1] = _inputs[0];\n')
    })

    test('NormalInput with child', async () => {
      const input: CompiledInput = {
        type: 'NormalInput',
        inputIndex: 0,
        children: [1]
      }
      const output = generator.includeCallback('constructInput', {
        input: input,
        valName: 'items',
        index: 1
      })
      expect(output).toBe('        items[1] = inputProperty0.inputs[1];\n')
    })

    test('NormalInput with child address', async () => {
      const input: CompiledInput = {
        type: 'NormalInput',
        inputIndex: 0,
        children: [-1]
      }
      const output = generator.includeCallback('constructInput', {
        input: input,
        valName: 'items',
        index: 1
      })
      expect(output).toBe(
        '        items[1] = abi.encodePacked(inputProperty0.predicateAddress);\n'
      )
    })

    test('NormalInput with 2 children', async () => {
      const input: CompiledInput = {
        type: 'NormalInput',
        inputIndex: 0,
        children: [1, 2]
      }
      const output = generator.includeCallback('constructInput', {
        input: input,
        valName: 'items',
        index: 1
      })
      expect(output).toBe(
        '        items[1] = inputProperty0Child1.inputs[2];\n'
      )
    })

    test('LabelInput', async () => {
      const input: CompiledInput = {
        type: 'LabelInput',
        label: 'FooF'
      }
      const output = generator.includeCallback('constructInput', {
        input: input,
        valName: 'items',
        index: 2
      })
      expect(output).toBe('        items[2] = utils.prefixLabel(FooF);\n')
    })

    test('VariableInput', async () => {
      const input: CompiledInput = {
        type: 'VariableInput',
        placeholder: 'a',
        children: []
      }
      const output = generator.includeCallback('constructInput', {
        input: input,
        valName: 'items',
        index: 3,
        witnessName: 'challengeInput'
      })
      expect(output).toBe('        items[3] = challengeInput;\n')
    })
  })
})
