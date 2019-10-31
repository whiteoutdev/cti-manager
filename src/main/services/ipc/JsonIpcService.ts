import {IpcChannel} from '../../../common/types/ipc/IpcChannel';
import {IpcMainService} from './IpcMainService';

export class JsonIpcService extends IpcMainService {
    public constructor() {
        super(IpcChannel.JSON);
    }
}
