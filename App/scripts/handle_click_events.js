// this file contains all the handler functions for the page
const { ipcRenderer } = require('electron')
const { dialog } = require('electron').remote
const { query_data } = require('./App/scripts/api_requests.js')

// defined globally so dont have to be requesting it all the time
let QUERY

function handle_client_key(element) {
    const newKey = element.value
    console.log(newKey)
    // saves in the local storage the user's key
    localStorage.setItem('clientKey', newKey)
}

function helper_get_query(totalImages, pageNumber) {
    const clientKey = document.getElementById('clientKey').value
    const query = document.getElementById('queryWords').value
    QUERY = query
    console.log("searched: ", query)
    if (query == '') {
        helper_display_preview()
    }
    return(query_data(clientKey, query, totalImages ? totalImages : 1, pageNumber ? pageNumber : 1))
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
    helper_get_query(null, null).then( (data) => {
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

function helper_download_photos(amount, destination, imageSize, pageNumber) {
    console.log(amount, pageNumber)
    helper_get_query(amount, pageNumber).then( (data) => {
        // TODO: change the size of the image accordingly
        console.log('download all the images')
        console.log(data)
        
        // should download the photos
        const photos = data.photos
        photos.forEach( (photo) => {
            const photoURL = photo.src[imageSize]
            const filename = photo.photographer+'-W'+photo.width+'-H'+photo.height
            ipcRenderer.send('download-image', photoURL, destination, filename, QUERY)
        })

        // if theres still photos to download go to the next page and keep downloading
        const newAmount = amount - photos.length
        if (newAmount > 0) {
            helper_download_photos(newAmount, destination, imageSize, pageNumber+1)
        }

    })
}
// handle the response and update progress bar
ipcRenderer.on('image-downloaded', (event, args) => {
    if (args == 'error') throw 'error'
    console.count(args)
})

function handle_download(event) {
    // TODO
    event.preventDefault()
    helper_get_query(null).then( (data) => {
        console.log('handle download')
        const maxPhotos = data.total_results
        const photosAmount = parseInt(document.getElementById('rs-bullet').innerText)

        if (photosAmount == 0) return // TODO: display error log saying that you need to select the amount of photos on the range slider

        const destinationPath = document.getElementById('destinationFolder').getAttribute('value')
        if (destinationPath == './DOWNLOADS/') console.log('default download path') // TODO: display message saying that is recommended to select a destination path, else will download to default path './DOWNLOADS/'

        const imageSize = document.getElementById('imageSize').selectedOptions[0].innerText

        // in case of bug it will default to the max of photos
        if (photosAmount > maxPhotos) photosAmount = maxPhotos

        helper_download_photos(photosAmount, destinationPath, imageSize, 1)

    })
}
