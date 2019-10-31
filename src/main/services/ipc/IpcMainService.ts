import {ipcMain, IpcMainEvent} from 'electron';
import * as pathToRegexp from 'path-to-regexp';
import {IpcChannel} from '../../../common/types/ipc/IpcChannel';
import {IpcRequest} from '../../../common/types/ipc/IpcRequest';
import {IpcResponse} from '../../../common/types/ipc/IpcResponse';

export type RequestHandler<Req, Res> = (req: IpcRequest<Req>, res: IpcResponse<Res>) => void;

export type PathHandler = [RegExp, RequestHandler<any, any>];

export abstract class IpcMainService {
    private running = false;
    private handlers: PathHandler[] = [];

    public constructor(protected readonly channel: IpcChannel) {
    }

    public on<Req, Res>(path: string | RegExp, handler: RequestHandler<Req, Res>): void {
        this.handlers.push([this.parseRegex(path), handler]);
    }

    public start<Req, Res>(): void {
        if (this.running) {
            return;
        }

        this.running = true;

        ipcMain.on(this.channel, (event: IpcMainEvent, req: IpcRequest<Req>) => {
            this.handlers.some(([regex, handler]) => {
                const match = regex.exec(req.path);

                if (match) {
                    const res = new IpcResponse<Res>(event, req);
                    handler(req, res);
                }

                return !!match;
            });
        });
    }

    private parseRegex(path: string | RegExp): RegExp {
        if (path instanceof RegExp) {
            return path;
        } else if (typeof path === 'string') {
            return pathToRegexp(path);
        } else {
            return /.*/;
        }
    }
}
