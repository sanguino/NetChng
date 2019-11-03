const {app, BrowserWindow, nativeTheme, globalShortcut, ipcMain} = require('electron');

const Networksetup = require('./Networksetup.js');
const ContextMenu = require('./ContextMenu.js');
const settings = require('electron-settings');

let win;
let contextMenu;

function openModal(data) {
  if (!win) {
    win = new BrowserWindow({
      width: 800, height: 600,
      //frame: false,
      webPreferences: {
        nodeIntegration: true,
      },
      useContentSize: true,
      modal: true, maximizable: false, fullscreenable: false, resizable: false, minimizable: false,
      show: false,
      backgroundColor: nativeTheme.shouldUseDarkColors ? '#2a2a2e' : '#fff'
    });

    win.on('ready-to-show', () => {
      win.webContents.send('shouldUseDarkColors', nativeTheme.shouldUseDarkColors);
      win.webContents.send('data', {...data, openAtLogin: app.getLoginItemSettings().openAtLogin});
      win.show()
    });

    //win.webContents.openDevTools();
    win.on('closed', () => {
      win = null
    });

    win.loadURL(`file://${__dirname}/settings/index.html`)
  } else {
    win.show();
  }
}

app.on('window-all-closed', e => e.preventDefault());

app.on('ready', () => {
  globalShortcut.register('CmdOrCtrl+R', () => {});
  contextMenu = new ContextMenu();

  Networksetup.getList().then(list => {
    contextMenu.create(openModal);
  });
});


nativeTheme.addListener('updated', () => {
  win && win.webContents.send('shouldUseDarkColors', nativeTheme.shouldUseDarkColors)
})

ipcMain.on('selectedAdapters', (event, selectedAdapters) => {
  settings.set('selectedAdapters', selectedAdapters)
  contextMenu.create(openModal);
});

ipcMain.on('openAtLogin', (event, openAtLogin) => {
  app.setLoginItemSettings({openAtLogin, openAsHidden: true});
});
