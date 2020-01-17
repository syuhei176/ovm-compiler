# ovm-compiler

[![Build Status](https://travis-ci.org/cryptoeconomicslab/ovm-compiler.svg?branch=master)](https://travis-ci.org/cryptoeconomicslab/ovm-compiler)

## Usage

```
npm i @cryptoeconomicslab/ovm-compiler
```

```js
const { Parser, SolidityCodeGenerator, Transpiler } = require('ovm-compiler')

const parser = new Parser()
const generator = new SolidityCodeGenerator()
const compiledPredicates = Transpiler.calculateInteractiveNodes(
  parser.parse(
    'def ownership(owner) := with Tx(su) as tx { SignedBy(tx, owner) }' +
      'def SignedBy(message, owner) := with Bytes() as signature {IsValidSignature(message, owner, signature)}'
  )
)
const result = generator.generate(compiledPredicates)
console.log(result)
```

## Online Demo

https://ovm-compiler.netlify.com

## Test

```
npm test
```
