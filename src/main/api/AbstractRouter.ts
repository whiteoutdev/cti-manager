import {ImageIpcService} from '../services/ipc/ImageIpcService';
import {IpcServiceManager} from '../services/ipc/IpcServiceManager';
import {JsonIpcService} from '../services/ipc/JsonIpcService';

export abstract class AbstractRouter {
    protected get imageService(): ImageIpcService {
        return IpcServiceManager.imageService;
    }

    protected get jsonService(): JsonIpcService {
        return IpcServiceManager.jsonService;
    }

    public abstract init(): void;
}
