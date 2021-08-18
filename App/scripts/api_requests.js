const { createClient } = require('pexels')

async function query_data(clientKey, query, perPage, pageNumber) {
    const client = createClient(clientKey);
    return client.photos.search({ query, per_page: perPage, pageNumber })
        .then( (photos) => {
            return(photos)
        });
}

module.exports = { query_data }
