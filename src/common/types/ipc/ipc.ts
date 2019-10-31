import {IpcChannel} from './channel';

export interface IpcRequest<T> {
    id: string;
    type: IpcChannel;
    body?: T;
}

export interface IpcResponse<T> {
    body?: T;
}
