// this file contains all the handler functions for the page
const { ipcRenderer } = require('electron')
const { query_data } = require('./App/scripts/api_requests.js')

function handle_client_key(element) {
    const newKey = element.value
    console.log(newKey)

    // saves in the local storage the user's key
    localStorage.setItem('clientKey', newKey)

}

function handle_submit(event) {
    event.preventDefault()
    const clientKey = document.getElementById('clientKey').value
    const query = document.getElementById('queryWords').value
    console.log("searched: ", query)

    query_data(clientKey, query).then( (data) => {
        console.log(data)
        console.log(data.photos)
        const photoURL = data.photos[0].src.landscape
        const newImg = document.createElement('img')
        newImg.setAttribute('src', photoURL)
        newImg.setAttribute('alt', photoURL)
        document.getElementById('photos').appendChild(newImg)
    })

}
