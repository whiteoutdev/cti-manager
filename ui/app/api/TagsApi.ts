import appConfig from '../config/app.config';
import UrlService from '../services/UrlService';
import TagActions from '../actions/TagActions';
import AbstractApi from './AbstractApi';
import Tag from '../model/tag/Tag';

const apiPath = appConfig.api.path;

class TagsApi extends AbstractApi {
    getTags(query?: string, skip?: number, limit?: number): Promise<Tag[]> {
        let url = `${apiPath}/tags`;
        url += UrlService.createQueryString({query, skip, limit});
        return this.getData(url);
    }

    getTag(tagId: string): Promise<Tag> {
        return this.getData(`${apiPath}/tags/${tagId}`);
    }

    getTagTypes(): Promise<string[]> {
        return this.getData(`${apiPath}/tagtypes`);
    }

    updateTag(tagId: string, updatedTag: Tag) {
        return this.postData(`${apiPath}/tags/${tagId}`, updatedTag)
            .then(data => {
                TagActions.updateTag(tagId);
                return data;
            });
    }
}

export default new TagsApi();
