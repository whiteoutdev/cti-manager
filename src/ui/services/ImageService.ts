import {Image, ImageRequest} from '../../common/types/models/Image';
import {JsonService} from './ipc/JsonService';

export class ImageService {
    private readonly jsonService = new JsonService();

    public async createImage(image: ImageRequest): Promise<void> {
        await this.jsonService.post('/images', {
            path: image.path,
        });
    }

    public async getImages(): Promise<Image[]> {
        return await this.jsonService.get('/images');
    }
}
