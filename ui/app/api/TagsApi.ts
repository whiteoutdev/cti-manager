import appConfig from '../config/app.config';
import UrlService from '../services/UrlService';
import TagActions from '../actions/TagActions';
import AbstractApi from './AbstractApi';

const apiPath = appConfig.api.path;

class TagsApi extends AbstractApi {
    getTags(query: string, skip: number, limit: number) {
        let url = `${apiPath}/tags`;
        url += UrlService.createQueryString({query, skip, limit});
        return this.getData(url);
    }

    getTag(tagId: string) {
        return this.getData(`${apiPath}/tags/${tagId}`);
    }

    getTagTypes() {
        return this.getData(`${apiPath}/tagtypes`);
    }

    updateTag(tagId: string, updatedTag) {
        return this.postData(`${apiPath}/tags/${tagId}`, updatedTag)
            .then(data => {
                TagActions.updateTag(tagId);
                return data;
            });
    }
}

export default new TagsApi();