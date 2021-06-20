const { app, BrowserWindow } = require('electron')
const isDev = require('electron-is-dev')
const path = require('path')
let win
function create() {
  win = new BrowserWindow({
    width: 1000,
    height: 680,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
    },
  })

  win.loadFile(path.resolve(__dirname, '../../renderer/pages/control/index.html'))
  // win.loadURL('http://127.0.0.1:5500/app/renderer/pages/control/index.html')
}
function send(channel, ...args) {
  // console.log('channel, ...args', channel, args)
  win.webContents.send(channel, ...args)
}
module.exports = { create, send }
