import {IpcRequest} from '../types/ipc/ipc';
import {IpcChannel} from '../types/ipc/channel';

export function responseChannel(request: IpcRequest<any>): string {
    return `${request.type}-${request.id}`;
}
