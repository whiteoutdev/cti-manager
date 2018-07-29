import appConfig from '../config/app.config';
import Media from '../model/media/Media';
import Thumbnail from '../model/media/Thumbnail';
import UrlService from '../services/UrlService';
import AbstractApi from './AbstractApi';

const apiPath   = appConfig.api.path,
      mediaPath = `${apiPath}/media`;

interface MediaResult {
    media: Media[];
    count: number;
}

class MediaApi extends AbstractApi {
    public findMedia(tags: string[], skip: number, limit: number): Promise<MediaResult> {
        let url = `${mediaPath}`;
        url += UrlService.createQueryString({
            tags: tags instanceof Array ? tags.join() : null,
            skip,
            limit
        });
        return this.getData(url)
            .then(data => {
                data.media = data.media || [];
                return data;
            });
    }

    public getMedia(id: string): Promise<Media> {
        return this.getData(`${mediaPath}/${id}`);
    }

    public getMediaThumbnail(id: string): Promise<Thumbnail> {
        return this.getData(`${mediaPath}/${id}/thumbnail`);
    }

    // TODO: Sort out typings on this
    public uploadFiles(formData: FormData): Promise<any> {
        return this.postData(mediaPath, formData);
    }

    public setTags(id: string, tags: string[]): Promise<Media> {
        return this.postData(`${mediaPath}/${id}/tags`, {tags});
    }

    public getSupportedMimeTypes(): Promise<string[]> {
        return this.getData(`${apiPath}/mediatypes`);
    }
}

export default new MediaApi();
