try {
  const { app, Menu, MenuItem, Tray } = require('electron')
  const { show: showMainWindow } = require('../windows/main')
  const { create: createAboutWindow } = require('../windows/about')
  const path = require('path')

  let tray
  function setTray() {
    tray = new Tray(path.resolve(__dirname, './icon_darwin.png'))
    tray.on('click', () => {
      showMainWindow()
    })
    tray.on('right-click', () => {
      const contextMenu = Menu.buildFromTemplate([
        {
          label: '显示',
          click: showMainWindow,
        },
        {
          label: '退出',
          click: app.quit,
        },
      ])
      tray.popUpContextMenu(contextMenu)
    })
  }

  function setAppMenu() {
    let appMenu = Menu.buildFromTemplate([
      {
        label: app.name,
        submenu: [
          {
            label: '关于 Mercurius',
            click: createAboutWindow,
          },
          {
            type: 'normal',
            label: '打开控制台',
            // role: 'help',
            click: (MenuItem, win, event) => {
              win.webContents.openDevTools()
            },
          },
          { type: 'separator' },
          { role: 'services', label: '服务' },
          { type: 'separator' },
          { role: 'hide', label: '隐藏' },
          { role: 'hideothers', label: '隐藏其他' },
          { role: 'unhide', label: '显示所有' },
          { type: 'separator' },
          { role: 'quit', label: '退出' },
        ],
      },
      { role: 'fileMenu' },
      { role: 'windowMenu' },
      { role: 'editMenu' },
    ])
    app.applicationMenu = appMenu
  }

  app
    .whenReady()
    .then(() => {
      setTray()
      setAppMenu()
    })
    .catch((e) => {
      console.log('darwin -error', e)
    })
} catch (error) {
  console.log('darwin -errrrr', error)
}
