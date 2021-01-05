const { fstat } = require("fs")
const P2G = require('../')
const fs =  require('fs')
const path = require('path')

function _path(p ) {
  return path.resolve(__dirname, p)
}

async function exportPly( f ) {
  var ply = await fs.promises.readFile( _path( `plys/${f}.ply`), 'UTF-8' )

  var buff = await P2G.default.convert( ply, {
    attribs : [
      'x',
      'y',
      'z',
    ]
  } )

  await fs.promises.writeFile(  _path(`outputs/${f}.bin`), buff )
}



async function run(){

  var customPly = await fs.promises.readFile(  _path( 'plys/custom.ply'), 'UTF-8' )

  var buff = await P2G.default.convert( customPly, {
    attribs : [
      'x',
      'y',
      'z',
      'uv1',
      'uv2',
      'nx',
      'ny',
      'nz',
      'customAttri1',
      'customAttri2',
      'customAttri3',
    ]
  } )

  await fs.promises.writeFile( _path('outputs/custom_full.bin'), buff )


  const files = [
    'custom',
    'pc',
    'quad',
  ]

  for (const f of files) {
    await exportPly(f)
  }
}

run()