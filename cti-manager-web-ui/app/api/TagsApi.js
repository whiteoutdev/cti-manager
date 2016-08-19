import appConfig from '../config/app.config';
import http from '../services/http';
import UrlService from '../services/UrlService';

const apiPath = appConfig.api.path;

export default class TagsApi {
    static getTags(query, skip, limit) {
        let url = `${apiPath}/tags`;
        url += UrlService.createQueryString({query, skip, limit});
        return http.get(url).then((res) => {
            return res.data;
        });
    }
};
