const { app, BrowserWindow, ipcMain } = require('electron')
const { download_image } = require('./App/scripts/handle_download_image.js')
const path = require('path')
const isDev = process.env.APP_DEV ? (process.env.APP_DEV.trim() == "true") : false

// modify your existing createWindow() function
function createWindow() {
    const win = new BrowserWindow({
        width: 600,
        height: 900,
        devTools: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            preload: path.join(app.getAppPath(), 'preload.js')
        }
    })

     if (!isDev) {
        win.removeMenu()
     }

    win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()
})

// handle the file download (must be handled on the main thread)
ipcMain.on('download-image', (event, url, filepath, filename, query) => {
    console.log('got data, will download', url, filepath, filename)
    download_image(url, path.join(filepath, query), filename).then( (res) => {
        event.reply('image-downloaded', 'downloaded')
    }).catch( (err) => {
        if (err) throw err
        event.reply('image-downloaded', 'error')
    })
})
