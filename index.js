const path = require('path')
const Jimp = require('jimp')
const CFonts = require('cfonts')
const filename = require('file-name')
const color = require('colors-cli/safe')
const countFiles = require('count-files')
const cliProgress = require('cli-progress')
const renameExtension = require('rename-extension')
const { getAllFilesSync } = require('get-all-files')


const errorColored = color.red.bold
const inputDir = path.join(__dirname, 'input')
const outputDir = path.join(__dirname, 'output')
const progressBar = new cliProgress.SingleBar(cliProgress.Presets.shades_classic)


CFonts.say('Prolibu|Image Manager.', { font: 'tiny' })


function totalFiles (inputDir) {
  return new Promise((resolve, reject) => {
    countFiles(inputDir, function (err, results) {
      if (err) return reject(err)
      resolve(results)
    })
  })
}


function transform ({ fileDir, name }) {
  return new Promise((resolve, reject) => {
    Jimp.read(fileDir, (err, lenna) => {
      if (err) reject(err)
      resolve(lenna.write(name))
    })
  })
}


async function run ({ inputDir }) {
  try {
    let filesTransformed = 0
    const { files } = await totalFiles(inputDir)
    progressBar.start(files, filesTransformed)

    for (const fileDir of getAllFilesSync(inputDir)) {
      const name = path.join(outputDir, renameExtension(filename(fileDir), '.jpg'))
      await transform ({ fileDir, name })
      progressBar.update(filesTransformed)
      filesTransformed += 1
    }
    
    progressBar.stop()
  } catch (err) {
    throw err
  }
}


run({ inputDir }).catch(err => {
  console.log('\n' + errorColored(err))
}) 


