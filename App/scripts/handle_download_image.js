'use strict'

const fs = require('fs')  
const path = require('path')  
const axios = require('axios')

const download_image = async (url, filepath, filename) => {  
  const writer = fs.createWriteStream(path.join(filepath, filename))

  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream'
  })

  response.data.pipe(writer)

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve)
    writer.on('error', reject)
  })
}

module.exports = { download_image }
