const { generateSolidityCode } = require('./')
const fs = require('fs')
const path = require('path')

generate('checkpoint')

function generate(name) {
  const source = fs.readFileSync(
    path.join(__dirname, `./examples/${name}/${name}.txt`)
  )
  const output = generateSolidityCode(source.toString())
  fs.writeFileSync(
    path.join(__dirname, `./examples/${name}/${getContractName(name)}.sol`),
    output
  )
}

function getContractName(name) {
  return name[0].toUpperCase() + name.substr(1)
}
