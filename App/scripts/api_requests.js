const { createClient } = require('pexels')

function query_data(clientKey, query) {
    const client = createClient(clientKey);
    return client.photos.search({ query, per_page: 1 })
        .then( (photos) => {
            return(photos)
        });
}

module.exports = { query_data }
