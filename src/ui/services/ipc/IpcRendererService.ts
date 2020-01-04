import {ipcRenderer, IpcRendererEvent} from 'electron';
import HTTPMethod from 'http-method-enum';
import {IpcChannel} from '../../../common/types/ipc/IpcChannel';
import {IpcRequest} from '../../../common/types/ipc/IpcRequest';
import {IpcResponseData} from '../../../common/types/ipc/IpcResponseData';
import {responseChannel} from '../../../common/utils/ipcUtils';

export abstract class IpcRendererService<R = any> {
    public constructor(protected readonly channel: IpcChannel) {
    }

    public request<Req, Res>(path: string, method = HTTPMethod.GET, body?: Req): Promise<R> {
        return new Promise(resolve => {
            const request = new IpcRequest<Req>(this.channel, path, method, body);
            ipcRenderer.send(this.channel, request);
            ipcRenderer.once(responseChannel(request), (event: IpcRendererEvent, value: IpcResponseData<Res>) => {
                Promise.resolve(this.parseResponse(value)).then(parsed => resolve(parsed));
            });
        });
    }

    public get<Req, Res>(path: string): Promise<R> {
        return this.request<Req, Res>(path);
    }

    public post<Req, Res>(path: string, body?: Req): Promise<R> {
        return this.request<Req, Res>(path, HTTPMethod.POST, body);
    }

    protected abstract parseResponse<Res>(res: IpcResponseData<Res>): R | Promise<R>;
}
