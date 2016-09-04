import appConfig from '../config/app.config';
import http from '../services/http';
import UrlService from '../services/UrlService';

const apiPath = appConfig.api.path;

export default class ImagesApi {
    static getImages(tags, skip, limit) {
        let url = `${apiPath}/images`;
        url += UrlService.createQueryString({
            tags: tags instanceof Array ? tags.join() : null,
            skip,
            limit
        });
        return http.get(url)
            .then((res) => {
                return res.data;
            });
    }

    static getImage(id) {
        const url = `${apiPath}/images/${id}`;
        return http.get(url)
            .then((res) => {
                return res.data;
            });
    }

    static getImageThumbnail(id) {
        const url = `${apiPath}/images/${id}/thumbnail`;
        return http.get(url)
            .then((res) => {
                return res.data;
            });
    }

    static uploadFiles(formData) {
        const url = `${apiPath}/images`;
        return http.post(url, formData);
    }

    static setTags(id, tags) {
        const url = `${apiPath}/images/${id}/tags`;
        return http.post(url, {tags}).then((res) => {
            return res.data;
        });
    }
}
