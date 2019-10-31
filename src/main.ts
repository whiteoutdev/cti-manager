import {app, BrowserWindow} from 'electron';
import {client} from 'electron-connect';
import {resolve} from 'path';
import {IpcRequest} from './common/types/ipc/IpcRequest';
import {IpcResponse} from './common/types/ipc/IpcResponse';
import {JsonIpcService} from './main/services/ipc/JsonIpcService';

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

    const jsonService = new JsonIpcService();

    jsonService.on('/hello', (req: IpcRequest<void>, res: IpcResponse<{hello: string}>) => {
        res.status(200).send({hello: 'world'});
    });

    jsonService.start();
}
