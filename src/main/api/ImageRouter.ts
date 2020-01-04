import {IpcRequest} from '../../common/types/ipc/IpcRequest';
import {IpcResponse} from '../../common/types/ipc/IpcResponse';
import {Image, ImageRequest} from '../../common/types/models/Image';
import {DbManager} from '../db/DbManager';
import {AbstractRouter} from './AbstractRouter';

export class ImageRouter extends AbstractRouter {
    public init(): void {
        this.jsonService.post('/images', async(req: IpcRequest<ImageRequest>, res: IpcResponse<Image>) => {
            const imageRequest = req.body;
            const image: Image = {
                path    : imageRequest.path,
                mimeType: 'image/jpeg',
            };
            const imageCollection = await DbManager.getImageCollection();
            const inserted = await imageCollection.insertOne(image);
            res.status(200).send(inserted);
        });

        this.jsonService.get('/images', async(req: IpcRequest<void>, res: IpcResponse<Image[]>) => {
            const imageCollection = await DbManager.getImageCollection();
            const images = await imageCollection.find({});
            res.status(200).send(images);
        });
    }
}
