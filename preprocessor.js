const fs = require('fs')
const path = require('path')

convert(path.join(__dirname, './src/parser/chamber.peg'))
convert(path.join(__dirname, './src/generator/sol.ejs'))
convert(path.join(__dirname, './src/generator/decide.ejs'))
convert(path.join(__dirname, './src/generator/getChild.ejs'))

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
