import appConfig from '../config/app.config';
import UrlService from '../services/UrlService';
import AbstractApi from './AbstractApi';

const apiPath   = appConfig.api.path,
      mediaPath = `${apiPath}/media`;

class MediaApi extends AbstractApi {
    findMedia(tags, skip, limit) {
        let url = `${mediaPath}`;
        url += UrlService.createQueryString({
            tags: tags instanceof Array ? tags.join() : null,
            skip,
            limit
        });
        return this.getData(url);
    }

    getMedia(id) {
        return this.getData(`${mediaPath}/${id}`);
    }

    getMediaThumbnail(id) {
        return this.getData(`${mediaPath}/${id}/thumbnail`);
    }

    uploadFiles(formData) {
        return this.postData(mediaPath, formData);
    }

    setTags(id, tags) {
        return this.postData(`${mediaPath}/${id}/tags`, {tags});
    }

    getSupportedMimeTypes() {
        return this.getData(`${apiPath}/mediatypes`);
    }
}

export default new MediaApi();
