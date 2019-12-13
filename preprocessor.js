const fs = require('fs')
const path = require('path')

const list = [
  './src/parser/chamber.peg',
  './src/generator/sol.ejs',
  './src/generator/decide.ejs',
  './src/generator/getChild.ejs',
  './src/generator/constructProperty.ejs',
  './src/generator/constructInputs.ejs',
  './src/generator/decideProperty.ejs'
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
