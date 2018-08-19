import appConfig from '../config/app.config';
import Media from '../model/media/Media';
import Thumbnail from '../model/media/Thumbnail';
import UrlService from '../services/UrlService';
import AbstractApi from './AbstractApi';

const apiPath   = appConfig.api.path,
      mediaPath = `${apiPath}/media`;

export interface MediaResult {
    media: Media[];
    skip: number;
    limit: number;
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

    public getMediaDownloadUrl(id: string): string {
        return `${mediaPath}/${id}/download`;
    }

    public getMediaThumbnail(id: string): Promise<Thumbnail> {
        return this.getData(`${mediaPath}/${id}/thumbnail`);
    }

    public getMediaThumbnailDownloadUrl(id: string): string {
        return `${mediaPath}/${id}/thumbnail/download`;
    }

    // TODO: Sort out typings on this
    public uploadFiles(files: FileList): Promise<any> {
        const formData = new FormData();
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < files.length; i++) {
            const file   = files[i],
                  reader = new FileReader();
            reader.readAsDataURL(file);
            formData.append('media', file);
        }
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
