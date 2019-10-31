import {ipcRenderer, IpcRendererEvent} from 'electron';
import {IpcChannel} from '../../../common/types/ipc/IpcChannel';
import {IpcRequest} from '../../../common/types/ipc/IpcRequest';
import {IpcResponseData} from '../../../common/types/ipc/IpcResponseData';
import {responseChannel} from '../../../common/utils/ipcUtils';

export abstract class IpcRendererService<R = any> {
    public constructor(protected readonly channel: IpcChannel) {
    }

    public request<Req, Res>(path: string, body?: Req): Promise<R> {
        return new Promise(resolve => {
            const request = new IpcRequest<Req>(this.channel, path, body);
            ipcRenderer.send(this.channel, request);
            ipcRenderer.once(responseChannel(request), (event: IpcRendererEvent, value: IpcResponseData<Res>) => {
                Promise.resolve(this.parseResponse(value)).then(parsed => resolve(parsed));
            });
        });
    }

    protected abstract parseResponse<Res>(res: IpcResponseData<Res>): R | Promise<R>;
}
