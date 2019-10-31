import {IpcMainEvent} from 'electron';
import {responseChannel} from '../../utils/ipcUtils';
import {IpcRequest} from './IpcRequest';
import {IpcResponseData} from './IpcResponseData';

export interface IpcResponse<T> {
    body?: T;
}

export class IpcResponse<T> {
    public readonly channel: string;

    private _status = 200;
    private _data: T;

    public constructor(
        private readonly event: IpcMainEvent,
        private readonly req: IpcRequest<any>,
    ) {
        this.channel = responseChannel(req);
    }

    public status(status: number): this {
        this._status = status;
        return this;
    }

    public data(data: T): this {
        this._data = data;
        return this;
    }

    public end(): this {
        this.event.reply(this.channel, this.constructResponse());
        return this;
    }

    public send(data?: T): this {
        return this.data(data).end();
    }

    private constructResponse(): IpcResponseData<T> {
        return {
            status: this._status,
            data  : this._data,
        };
    }
}
