import {app, BrowserWindow} from 'electron';
import * as electronReload from 'electron-reload';

let mainWindow: BrowserWindow;

electronReload(__dirname);

app.on('ready', createMainWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (!mainWindow) {
        createMainWindow();
    }
});

function createMainWindow(): void {
    mainWindow = new BrowserWindow({
        width : 1600,
        height: 1000,
    });

    mainWindow.loadFile('index.html');

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}
