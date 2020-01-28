import { generateEVMByteCode } from './'
import { Import } from '@cryptoeconomicslab/ovm-parser'
import fs from 'fs'
import path from 'path'

const examplePath = '../../../examples'

compileAllExamples().then(console.log)

async function compileAllExamples() {
  await generate('checkpoint')
  await generate('limboExit')
  await generate('order')
  await generate('swap')
  await generate('ownership')
  await generate('su')
  return 'all examples compiled'
}

async function generate(name: string) {
  console.log(`compiling ${name}`)
  const source = fs.readFileSync(
    path.join(__dirname, examplePath, `${name}/${name}.txt`)
  )
  /*
  const output = await generateSolidityCode(source.toString())
  fs.writeFileSync(
    path.join(__dirname, examplePath, `${name}/${getContractName(name)}.sol`),
    output
  )
  */
  const evmOutput = await generateEVMByteCode(
    source.toString(),
    (_import: Import) => ''
  )
  fs.writeFileSync(
    path.join(__dirname, examplePath, `${name}/${getContractName(name)}.json`),
    evmOutput
  )
  console.log(`compiled ${name}`)
}

function getContractName(name: string) {
  return name[0].toUpperCase() + name.substr(1)
}
