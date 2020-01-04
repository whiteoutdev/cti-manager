import {IpcChannel} from '../../../common/types/ipc/IpcChannel';
import {IpcMainService} from './IpcMainService';

export class ImageIpcService extends IpcMainService {
    public constructor() {
        super(IpcChannel.IMAGE);
    }
}
