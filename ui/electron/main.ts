import { app, BrowserWindow } from 'electron';
import path from 'node:path';
import { spawn } from 'child_process';

let win: BrowserWindow | null = null;

// Set environment variables for asset paths
process.env.DIST = path.join(__dirname, '../dist');
process.env.VITE_PUBLIC = app.isPackaged
  ? process.env.DIST
  : path.join(process.env.DIST, '../public');

// Use ['ENV_VAR'] to avoid Vite define plugin issues
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];

function startServers(): Promise<void> {
  return Promise.all([
    new Promise<void>((resolve, reject) => {
      const server1 = spawn('npm', ['start'], {
        cwd: 'C:\\Users\\spiri\\Documents\\NextLife',
        shell: true,
        stdio: 'inherit',
        windowsHide: true
      });

      server1.on('error', reject);

      // Adjust timeout or better wait for a ready event
      setTimeout(() => resolve(), 3000);
    }),

    new Promise<void>((resolve, reject) => {
      const server2 = spawn('npm', ['run', 'dev'], {
        cwd: 'C:\\Users\\spiri\\Documents\\NextLife\\ui',
        shell: true,
        stdio: 'inherit',
        windowsHide: true
      });

      server2.on('error', reject);

      setTimeout(() => resolve(), 3000);
    }),
  ]).then(() => undefined);
}

function createWindow() {
  win = new BrowserWindow({
    width: 1920,
    height: 1080,
    icon: path.join(process.env.VITE_PUBLIC!, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false
    },
  });

  // Send a test message to renderer when loaded
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString());
  });

  // Load from dev server or built file
  // if (VITE_DEV_SERVER_URL) {
  //   win.loadURL(VITE_DEV_SERVER_URL);
  // } 
  // else {
  //   win.loadFile(path.join(process.env.DIST!, 'ui/index.html'));
  // }
  win.loadURL('http://localhost:5173');
}

// Handle macOS app behavior
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    win = null;
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Start the app
// app.whenReady().then(createWindow);

app.whenReady()
  .then(() => startServers()) // start server before UI
  .then(() => createWindow())
  .catch((err) => {
    console.error('Failed to start server:', err);
    app.quit();
  });
