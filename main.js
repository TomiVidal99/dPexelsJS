const { app, BrowserWindow, ipcMain } = require('electron')
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
