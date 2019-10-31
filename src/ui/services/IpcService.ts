import {ipcRenderer, IpcRendererEvent} from 'electron';
import {IpcChannel} from '../../common/types/ipc/channel';
import {IpcRequest, IpcResponse} from '../../common/types/ipc/ipc';
import {responseChannel} from '../../common/utils/ipcUtils';
import v4 = require('uuid/v4');

export class IpcService {
    public request<Req, Res>(body: Req): Promise<Res> {
        return new Promise(resolve => {
            const id = v4();
            const request: IpcRequest<Req> = {
                id,
                type: IpcChannel.REQUEST,
                body,
            };
            ipcRenderer.send(request.type, request);
            ipcRenderer.once(responseChannel(request), (event: IpcRendererEvent, value: IpcResponse<Res>) => {
                resolve(value.body);
            });
        });
    }
}
