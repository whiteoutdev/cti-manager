import appConfig from '../config/app.config';
import http from '../services/http';
import UrlService from '../services/UrlService';

const apiPath   = appConfig.api.path,
      mediaPath = `${apiPath}/media`;

export default class MediaApi {
    static findMedia(tags, skip, limit) {
        let url = `${mediaPath}`;
        url += UrlService.createQueryString({
            tags: tags instanceof Array ? tags.join() : null,
            skip,
            limit
        });
        return http.get(url).then(res => res.data);
    }

    static getMedia(id) {
        return http.get(`${mediaPath}/${id}`)
            .then(res => res.data);
    }

    static getMediaThumbnail(id) {
        return http.get(`${mediaPath}/${id}/thumbnail`)
            .then(res => res.data);
    }

    static uploadFiles(formData) {
        const url = `${mediaPath}`;
        return http.post(url, formData);
    }

    static setTags(id, tags) {
        const url = `${mediaPath}/${id}/tags`;
        return http.post(url, {tags})
            .then(res => res.data);
    }

    static getSupportedMimeTypes() {
        return http.get(`${apiPath}/mediatypes`)
            .then(res => res.data);
    }
}
