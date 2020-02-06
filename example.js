const { generateEVMByteCode } = require('./packages/ethereum-generator')
const { generateSolidityCode } = require('./packages/solidity-generator')
const fs = require('fs')
const path = require('path')

const examplesPath = './examples'
const libraryPath = path.join(__dirname, examplesPath, 'lib')
compileAllExamples().then(console.log)

async function compileAllExamples() {
  await generate('checkpoint')
  await generate('limboExit')
  await generate('order')
  await generate('ownership')
  await generate('su')
  await generate('swap')
  return 'all examples compiled'
}

async function generate(name) {
  console.log(`compiling ${name}`)
  const importHandler = _import =>
    fs
      .readFileSync(
        path.join(libraryPath, _import.path, _import.module + '.ovm')
      )
      .toString()

  const source = fs.readFileSync(
    path.join(__dirname, examplesPath, name, `${name}.txt`)
  )
  const output = await generateSolidityCode(source.toString(), importHandler)
  fs.writeFileSync(
    path.join(__dirname, examplesPath, name, `${getContractName(name)}.sol`),
    output
  )
  const evmOutput = await generateEVMByteCode(source.toString(), importHandler)
  fs.writeFileSync(
    path.join(__dirname, examplesPath, name, `${getContractName(name)}.json`),
    evmOutput
  )
  console.log(`compiled ${name}`)
}

function getContractName(name) {
  return name[0].toUpperCase() + name.substr(1)
}
