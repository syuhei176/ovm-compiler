const { generateSolidityCode, generateEVMByteCode } = require('./')
const fs = require('fs')
const path = require('path')

generate('checkpoint')
generate('limboExit')
generate('order')
generate('ownership')
generate('su')

function generate(name) {
  console.log(`compiling ${name}`)
  const source = fs.readFileSync(
    path.join(__dirname, `./examples/${name}/${name}.txt`)
  )
  const output = generateSolidityCode(source.toString())
  fs.writeFileSync(
    path.join(__dirname, `./examples/${name}/${getContractName(name)}.sol`),
    output
  )
  const evmOutput = generateEVMByteCode(source.toString())
  fs.writeFileSync(
    path.join(__dirname, `./examples/${name}/${getContractName(name)}.json`),
    evmOutput
  )
  console.log(`compiled ${name}`)
}

function getContractName(name) {
  return name[0].toUpperCase() + name.substr(1)
}
