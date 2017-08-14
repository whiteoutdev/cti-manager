import TagActions from '../actions/TagActions';
import appConfig from '../config/app.config';
import Tag from '../model/tag/Tag';
import UrlService from '../services/UrlService';
import AbstractApi from './AbstractApi';

const apiPath = appConfig.api.path;

class TagsApi extends AbstractApi {
    public getTags(query?: string, skip?: number, limit?: number): Promise<Tag[]> {
        let url = `${apiPath}/tags`;
        url += UrlService.createQueryString({query, skip, limit});
        return this.getData(url);
    }

    public getTag(tagId: string): Promise<Tag> {
        return this.getData(`${apiPath}/tags/${tagId}`);
    }

    public getTagTypes(): Promise<string[]> {
        return this.getData(`${apiPath}/tagtypes`);
    }

    public updateTag(tagId: string, updatedTag: Tag): Promise<void> {
        return this.postData(`${apiPath}/tags/${tagId}`, updatedTag)
            .then(() => TagActions.updateTag(tagId));
    }
}

export default new TagsApi();
