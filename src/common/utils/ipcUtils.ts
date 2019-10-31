import {IpcRequest} from '../types/ipc/IpcRequest';

export function responseChannel(request: IpcRequest<any>): string {
    return `${request.channel}-${request.id}`;
}
