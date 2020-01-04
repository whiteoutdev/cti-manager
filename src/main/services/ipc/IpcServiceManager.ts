import {ImageIpcService} from './ImageIpcService';
import {JsonIpcService} from './JsonIpcService';

export class IpcServiceManager {
    public static readonly imageService = new ImageIpcService();
    public static readonly jsonService = new JsonIpcService();

    public static start(): void {
        IpcServiceManager.imageService.start();
        IpcServiceManager.jsonService.start();
    }
}
