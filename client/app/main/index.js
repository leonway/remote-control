const { app, BrowserWindow } = require('electron')
const handleIPC = require('./ipc')
const { create: createMainWindow, show: showMainWindow, close: closeMainWindow } = require('./windows/main')
if (require('electron-squirrel-startup')) app.quit()
app.allowRendererProcessReuse = false
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    showMainWindow()
  })
  app.on('ready', () => {
    createMainWindow()
    // createControlWindow()
    handleIPC()
    require('./trayAndMenu')
    require('./robot.js')()
  })
  app.on('before-quit', () => {
    closeMainWindow()
  })
  app.on('activate', () => {
    showMainWindow()
  })
}
