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
};
