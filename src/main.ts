import {app, BrowserWindow} from 'electron';
import {client} from 'electron-connect';
import * as unhandled from 'electron-unhandled';
import * as mkdirp from 'mkdirp';
import {resolve} from 'path';
import {promisify} from 'util';
import {DB_PATH} from './consts';
import {ImageRouter} from './main/api/ImageRouter';
import {IpcServiceManager} from './main/services/ipc/IpcServiceManager';

const mkdirpAsync = promisify(mkdirp);

unhandled();

let mainWindow: BrowserWindow;

app.on('ready', async() => {
    await initApplication();
    createMainWindow();
});

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
        width          : 1600,
        height         : 1000,
        webPreferences : {
            nodeIntegration: true,
            webSecurity    : false,
        },
        autoHideMenuBar: false,
    });

    console.log(app.getAppPath());
    console.log(__dirname);

    mainWindow.loadFile(resolve(__dirname, 'index.html'));

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    if (process.env.NODE_ENV === 'development') {
        client.create(mainWindow);
    }
}

async function initApplication(): Promise<void> {
    await mkdirpAsync(DB_PATH);
    IpcServiceManager.start();

    const imageRouter = new ImageRouter();

    imageRouter.init();
}


