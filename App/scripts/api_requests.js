'use strict'

const { createClient } = require('pexels')
const Fs = require('fs')  
const Path = require('path')  
const Axios = require('axios')

async function download_image(url, path) {  
  const writer = Fs.createWriteStream(path)

  const response = await Axios({
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

async function query_data(clientKey, query, perPage, pageNumber) {
    const client = createClient(clientKey);
    return client.photos.search({ query, per_page: perPage, pageNumber })
        .then( (photos) => {
            return(photos)
        });
}

module.exports = { query_data, download_image }
