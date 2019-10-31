import {IpcChannel} from '../../../common/types/ipc/IpcChannel';
import {IpcResponseData} from '../../../common/types/ipc/IpcResponseData';
import {IpcRendererService} from './IpcRendererService';

export class JsonService extends IpcRendererService {
    public constructor() {
        super(IpcChannel.JSON);
    }

    public sendHello(): Promise<{hello: string}> {
        return this.request('/hello');
    }

    protected parseResponse<Res>(res: IpcResponseData<Res>) {
        return res.data;
    }
}
