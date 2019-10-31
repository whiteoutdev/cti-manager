import {app, BrowserWindow, ipcMain, IpcMainEvent} from 'electron';
import {client} from 'electron-connect';
import {resolve} from 'path';

let mainWindow: BrowserWindow;

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
        width         : 1600,
        height        : 1000,
        webPreferences: {
            nodeIntegration: true,
        },
    });

    mainWindow.loadFile(resolve(app.getAppPath(), 'index.html'));

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    if (process.env.NODE_ENV === 'development') {
        client.create(mainWindow);
    }

    ipcMain.on('is-alive', (event: IpcMainEvent, value: string) => {
        console.log('is-alive request received');
        event.sender.send('is-alive', true);
    });
}
