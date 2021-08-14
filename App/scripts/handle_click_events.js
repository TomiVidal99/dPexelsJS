// this file contains all the handler functions for the page
const { ipcRenderer } = require('electron')
const { dialog } = require('electron').remote
const { query_data } = require('./App/scripts/api_requests.js')

function handle_client_key(element) {
    const newKey = element.value
    console.log(newKey)
    // saves in the local storage the user's key
    localStorage.setItem('clientKey', newKey)
}

function helper_get_query() {
    const clientKey = document.getElementById('clientKey').value
    const query = document.getElementById('queryWords').value
    console.log("searched: ", query)
    if (query == '') {
        helper_display_preview()
    }
    return(query_data(clientKey, query, 1))
}

function helper_display_preview() {
    const preview_element = document.getElementById('previewWrapper')
    if (preview_element.classList.contains('d-none')) {
        preview_element.classList.remove('d-none')
    } else {
        preview_element.classList.add('d-none')
    }
}

function helper_display_slider() {
    const slider_element = document.getElementById('slider')
    if (slider_element.classList.contains('d-none')) {
        slider_element.classList.remove('d-none')
    } else {
        slider_element.classList.add('d-none')
    }
}

function helper_set_max_photos(max) {
    const label_element = document.getElementById('photosMax')
    const range_element = document.getElementById('rs-range-line')
    range_element.setAttribute('max', max)
    label_element.innerText = max
}

function handle_get_preview() {
    helper_get_query().then( (data) => {
        console.log(data)
        const url = data.photos[0].src.medium
        const author = data.photos[0].photographer
        const preview_element = document.getElementById('previewContainer')
        const img = document.createElement('img')
        img.setAttribute('src', url)
        img.setAttribute('alt', author)
        if (preview_element.children.length > 0) {
            // already has a preview image, should remove it
            preview_element.children[0].remove()
        }
        helper_display_preview()
        preview_element.appendChild(img)
        const totalResults = data.total_results
        helper_set_max_photos(totalResults)
        helper_display_slider()
    })
}

function handle_size_select(event, element) {
    event.preventDefault()
    const value = element.selectedOptions[0].innerText
    // TODO
    console.log(element)
    console.log(value)
}

function handle_destination_folder(event, element) {
    event.preventDefault()
    // TODO: change the title accordingly to the language
    dialog.showOpenDialog({ title: 'Destination folder', properties: ['openDirectory'] }).then((result) => {
        if (result.canceled) return
        const path = result.filePaths
        // set the value of the button to the selected path
        const query = document.getElementById('queryWords').value.replace(' ', '_')
        if (query == "") return
        const pickedPath = path[0]+"/"+query
        element.value = pickedPath
        console.log("Picked path: ", pickedPath)
    })
}

function handle_download(event) {
    // TODO
    event.preventDefault()
    helper_get_query()
}
