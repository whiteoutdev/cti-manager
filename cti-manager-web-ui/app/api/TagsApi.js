import appConfig from '../config/app.config';
import http from '../services/http';
import UrlService from '../services/UrlService';
import TagActions from '../actions/TagActions';

const apiPath = appConfig.api.path;

export default class TagsApi {
    static getTags(query, skip, limit) {
        let url = `${apiPath}/tags`;
        url += UrlService.createQueryString({query, skip, limit});
        return http.get(url)
            .then(res => res.data);
    }

    static getTag(tagId) {
        return http.get(`${apiPath}/tags/${tagId}`)
            .then(res => res.data);
    }

    static getTagTypes() {
        return http.get(`${apiPath}/tagtypes`)
            .then(res => res.data);
    }

    static updateTag(tagId, updatedTag) {
        return http.post(`${apiPath}/tags/${tagId}`, updatedTag)
            .then((res) => {
                TagActions.updateTag(tagId);
                return res;
            });
    }
}
