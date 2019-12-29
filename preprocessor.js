const fs = require('fs')
const path = require('path')

const list = [
  './src/parser/chamber.peg',
  './src/generator/solidity/sol.ejs',
  './src/generator/solidity/decide.ejs',
  './src/generator/solidity/getChild.ejs',
  './src/generator/solidity/constructProperty.ejs',
  './src/generator/solidity/constructInputs.ejs',
  './src/generator/solidity/constructInput.ejs',
  './src/generator/solidity/decideProperty.ejs'
]

list.forEach(file => {
  convert(path.join(__dirname, file))
})

function convert(filePath) {
  const data = fs.readFileSync(filePath)
  const ext = path.extname(filePath)
  const newFilePath = path.join(
    path.dirname(filePath),
    path.basename(filePath, ext) + '.ts'
  )
  fs.writeFileSync(
    newFilePath,
    `const text = ${JSON.stringify(data.toString())}\nexport default text`
  )
}
