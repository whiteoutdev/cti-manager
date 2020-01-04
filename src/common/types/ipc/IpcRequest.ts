import HTTPMethod from 'http-method-enum';
import {IpcChannel} from './IpcChannel';
import v1 = require('uuid/v1');

export interface IpcRequest<T> {
    readonly id: string;
    readonly channel: IpcChannel;
    readonly method: HTTPMethod;
    readonly path: string;
    readonly body?: T;
}

export class IpcRequest<T> {
    public readonly id: string = v1();

    public constructor(
        public readonly channel: IpcChannel,
        public readonly path: string,
        public readonly method: HTTPMethod,
        public readonly body?: T,
    ) {
    }
}
