const { createClient } = require('pexels')

function query_data(clientKey, query, perPage) {
    const client = createClient(clientKey);
    return client.photos.search({ query, per_page: perPage })
        .then( (photos) => {
            return(photos)
        });
}

module.exports = { query_data }
