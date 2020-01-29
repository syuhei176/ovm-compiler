const { generateEVMByteCode } = require('./packages/ethereum-generator')
const { generateSolidityCode } = require('./packages/solidity-generator')
const fs = require('fs')
const path = require('path')

compileAllExamples().then(console.log)

async function compileAllExamples() {
  await generate('checkpoint')
  await generate('limboExit')
  await generate('order')
  await generate('ownership')
  await generate('su')
  return 'all examples compiled'
}

async function generate(name) {
  console.log(`compiling ${name}`)
  const source = fs.readFileSync(
    path.join(__dirname, `./examples/${name}/${name}.txt`)
  )
  const output = await generateSolidityCode(source.toString())
  fs.writeFileSync(
    path.join(__dirname, `./examples/${name}/${getContractName(name)}.sol`),
    output
  )
  const evmOutput = await generateEVMByteCode(source.toString())
  fs.writeFileSync(
    path.join(__dirname, `./examples/${name}/${getContractName(name)}.json`),
    evmOutput
  )
  console.log(`compiled ${name}`)
}

function getContractName(name) {
  return name[0].toUpperCase() + name.substr(1)
}
