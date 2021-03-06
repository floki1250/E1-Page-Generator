import { app, BrowserWindow, nativeTheme } from 'electron'
import path from 'path';
import { initialize } from '@electron/remote/main'

initialize()
try {
  if (process.platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
    require('fs').unlinkSync(require('path').join(app.getPath('userData'), 'DevTools Extensions'))
  }
} catch (_) { }

let mainWindow

function createWindow() {

  /**
   * Initial window options
   */
   
  mainWindow = new BrowserWindow({
    autoHideMenuBar: true,
    frame: true,
   // transparent: true,
    minWidth: 400,
    minHeight: 700,
    width: 400,
    height: 700,
    draggable: true,
    backgroundColor: "#0e122b",
    resizable: true,
    useContentSize: true,
    webPreferences: {
      zoomFactor: 0.8,
      nativeWindowOpen: true,
      enableRemoteModule: true,
      contextIsolation: false,
      nodeIntegration: true,
      // More info: /quasar-cli/developing-electron-apps/electron-preload-script
      preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD)
    }
  })
  // mainWindow.setMenu(null)
  //setVibrancy(mainWindow,'dark')
  
  mainWindow.loadURL(process.env.APP_URL)

  if (process.env.DEBUGGING) {
    // if on DEV or Production with debug enabled
    mainWindow.webContents.openDevTools()
  } else {
    // we're on production; no access to devtools pls
    mainWindow.webContents.on('devtools-opened', () => {
      mainWindow.webContents.closeDevTools()
    })
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })

}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
