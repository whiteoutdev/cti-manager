import appConfig from '../config/app.config';
import UrlService from '../services/UrlService';
import AbstractApi from './AbstractApi';

const apiPath   = appConfig.api.path,
      mediaPath = `${apiPath}/media`;

class MediaApi extends AbstractApi {
    findMedia(tags: string[], skip: number, limit: number) {
        let url = `${mediaPath}`;
        url += UrlService.createQueryString({
            tags: tags instanceof Array ? tags.join() : null,
            skip,
            limit
        });
        return this.getData(url);
    }

    getMedia(id: string) {
        return this.getData(`${mediaPath}/${id}`);
    }

    getMediaThumbnail(id: string) {
        return this.getData(`${mediaPath}/${id}/thumbnail`);
    }

    uploadFiles(formData: FormData) {
        return this.postData(mediaPath, formData);
    }

    setTags(id: string, tags: string[]) {
        return this.postData(`${mediaPath}/${id}/tags`, {tags});
    }

    getSupportedMimeTypes() {
        return this.getData(`${apiPath}/mediatypes`);
    }
}

export default new MediaApi();