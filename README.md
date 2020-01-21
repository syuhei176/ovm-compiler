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

## Roadmap

- [x] Plasma checkpoint example
- [x] Plasma exit example
- [x] Plasma ownership predicate example
- [x] Plasma swap predicate example
- [x] Plasma offline swap predicate example
- [ ] Plasma fast finality predicate example
- [ ] Plasma swap between main chain and Plasma chain predicate example
- [x] add parser
- [x] add byte code generator for ethereum
- [ ] add code generator for Substrate
- [ ] update language to write state transition

