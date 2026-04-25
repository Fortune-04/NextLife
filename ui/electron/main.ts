import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import fs from 'node:fs'
import { spawn, ChildProcess } from 'node:child_process'
import path from 'node:path'

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')

let win: BrowserWindow | null
let serverProcess: ChildProcess | null = null

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

function getBackendPath() {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, 'backend')
  }
  // In dev, the backend is in the parent directory of /ui
  return path.join(__dirname, '..', '..')
}

function startBackendServer(): Promise<void> {
  return new Promise((resolve) => {
    // In dev mode, the backend should be started separately (npm start in root)
    // because Electron's Node version may differ from system Node
    if (!app.isPackaged) {
      console.log('[Backend] Dev mode: skipping backend spawn. Run the backend server separately.')
      resolve()
      return
    }

    const backendPath = getBackendPath()
    const serverScript = path.join(backendPath, 'server.js')

    // Use Electron's own executable with ELECTRON_RUN_AS_NODE=1 as a Node.js runtime
    const nodeExe = process.execPath

    const env = {
      ...process.env,
      PORT: '4001',
      NODE_ENV: 'production',
      ELECTRON_RUN_AS_NODE: '1',
    }

    serverProcess = spawn(nodeExe, [serverScript], {
      cwd: backendPath,
      env,
      stdio: ['pipe', 'pipe', 'pipe'],
      windowsHide: true,
    })

    serverProcess.stdout?.on('data', (data: Buffer) => {
      const msg = data.toString().trim()
      console.log(`[Backend] ${msg}`)
      if (msg.includes('listening')) {
        resolve()
      }
    })

    serverProcess.stderr?.on('data', (data: Buffer) => {
      console.error(`[Backend Error] ${data.toString().trim()}`)
    })

    serverProcess.on('error', (err: Error) => {
      console.error('Failed to start backend server:', err)
      resolve()
    })

    serverProcess.on('exit', (code: number | null) => {
      console.log(`Backend server exited with code ${code}`)
      serverProcess = null
    })

    // Resolve after timeout regardless, so the window still opens
    setTimeout(resolve, 3000)
  })
}

function stopBackendServer() {
  if (serverProcess) {
    serverProcess.kill()
    serverProcess = null
  }
}

function createWindow() {
  win = new BrowserWindow({
    width: 1920,
    height: 1080,
    frame: false,
    titleBarStyle: 'hidden',
    icon: path.join(process.env.VITE_PUBLIC, 'nextlife.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(process.env.DIST, 'index.html'))
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    stopBackendServer()
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.on('before-quit', () => {
  stopBackendServer()
})

app.whenReady().then(async () => {
  ipcMain.on('window-minimize', () => {
    BrowserWindow.getFocusedWindow()?.minimize()
  })
  ipcMain.on('window-maximize', () => {
    const window = BrowserWindow.getFocusedWindow()
    if (window?.isMaximized()) {
      window.unmaximize()
    } else {
      window?.maximize()
    }
  })
  ipcMain.on('window-close', () => {
    BrowserWindow.getFocusedWindow()?.close()
  })

  ipcMain.handle('dialog-save-backup', async (_event, jsonData: string) => {
    const { canceled, filePath } = await dialog.showSaveDialog({
      title: 'Save Backup',
      defaultPath: `nextlife-backup-${new Date().toISOString().slice(0, 10)}.json`,
      filters: [{ name: 'JSON Files', extensions: ['json'] }],
    })
    if (canceled || !filePath) return { success: false, canceled: true }
    try {
      fs.writeFileSync(filePath, jsonData, 'utf-8')
      return { success: true, filePath }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  })

  ipcMain.handle('dialog-open-backup', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      title: 'Open Backup File',
      filters: [{ name: 'JSON Files', extensions: ['json'] }],
      properties: ['openFile'],
    })
    if (canceled || filePaths.length === 0) return { success: false, canceled: true }
    try {
      const content = fs.readFileSync(filePaths[0], 'utf-8')
      return { success: true, content }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  })

  await startBackendServer()
  createWindow()
})
