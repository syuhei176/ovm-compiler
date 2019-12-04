import { Parser } from './Parser'
import { PropertyDef } from './PropertyDef'
import fs from 'fs'
import path from 'path'

describe('Parser', () => {
  let parser: Parser
  beforeEach(async () => {
    parser = new Parser()
  })
  describe('parse', () => {
    test('return abstract syntax tree', () => {
      const ast: PropertyDef[] = parser.parse(
        'def test(a) := for b in A(a) {Foo(b) and Bar(b)}'
      )
      expect(ast).toStrictEqual([
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
      ])
    })

    test('bind operator', () => {
      const ast: PropertyDef[] = parser.parse(
        'def childEq(a) := with Bytes() as b {equal(b.0, a)}'
      )
      expect(ast).toStrictEqual([
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
                predicate: 'equal',
                type: 'PropertyNode'
              }
            ]
          }
        }
      ])
    })

    test('variable: eval1', () => {
      const testOutput = fs
        .readFileSync(
          path.join(__dirname, '../../examples/testcases/variable/eval1.txt')
        )
        .toString()
      const ast: PropertyDef[] = parser.parse(testOutput)
      expect(ast).toStrictEqual([
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
      ])
    })

    test('variable: eval2', () => {
      const testOutput = fs
        .readFileSync(
          path.join(__dirname, '../../examples/testcases/variable/eval2.txt')
        )
        .toString()
      const ast: PropertyDef[] = parser.parse(testOutput)
      expect(ast).toStrictEqual([
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
      ])
    })
  })
})
