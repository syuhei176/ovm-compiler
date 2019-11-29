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
      ]
      const output = generator.generate(input)
      /*
      fs.writeFileSync(
        path.join(__dirname, '../../examples/forall/Test.sol'),
        output
      )
      */
      const testOutput = fs.readFileSync(
        path.join(__dirname, '../../examples/forall/Test.sol')
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
                inputDefs: ['ChildEqT', 'b', 'a'],
                predicate: 'ThereExistsSuchThat',
                inputs: [
                  { predicate: 'Bytes', type: 'AtomicProposition', inputs: [] },
                  {
                    inputs: [[1, 0], 2],
                    predicate: 'equal',
                    type: 'AtomicProposition'
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
        path.join(__dirname, '../../examples/bind/ChildEq.sol'),
        output
      )
      */
      const testOutput = fs.readFileSync(
        path.join(__dirname, '../../examples/bind/ChildEq.sol')
      )
      expect(output).toBe(testOutput.toString())
    })

    test('return generated code with order', () => {
      const generator = new SolidityCodeGenerator()
      const input: CompiledPredicate[] = [
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
      ]
      const output = generator.generate(input)
      /*
      fs.writeFileSync(
        path.join(__dirname, '../../examples/order/Order.sol'),
        output
      )
      */
      const testOutput = fs.readFileSync(
        path.join(__dirname, '../../examples/order/Order.sol')
      )
      expect(output).toBe(testOutput.toString())
    })
  })
})
