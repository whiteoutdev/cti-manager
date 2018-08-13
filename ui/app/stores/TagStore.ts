import TagActions from '../actions/TagActions';
import TagsApi from '../api/TagsApi';
import Tag from '../model/tag/Tag';
import {StoreWithUser} from './StoreWithUser';

export interface TagStoreState {
    tags?: Tag[];
    tagIndex?: {[id: string]: Tag};
}

export class TagStore extends StoreWithUser<TagStoreState> {
    constructor() {
        super();
        this.state = Object.assign({}, this.state, {
            tags    : [],
            tagIndex: {}
        });
        this.listenTo(TagActions.updateTags, this.onUpdateTags);
        this.listenTo(TagActions.updateTag, this.onUpdateTag);
    }

    public onUserSet(): Promise<void> {
        return this.onUpdateTags();
    }

    public buildTagIndex(tags: Tag[]): {[id: string]: Tag} {
        const tagIndex: {[id: string]: Tag} = {};
        tags.forEach(tag => tagIndex[tag.id] = tag);
        return tagIndex;
    }

    public onUpdateTags(): Promise<void> {
        if (!this.user) {
            return Promise.resolve();
        }

        return TagsApi.getTags()
            .then(tags => {
                if (tags instanceof Array) {
                    const tagIndex = this.buildTagIndex(tags);
                    this.setState({tags, tagIndex});
                }
            });
    }

    public onUpdateTag(tagId: string): Promise<void> {
        return TagsApi.getTag(tagId)
            .then(tag => {
                const index = this.state.tags.findIndex(oldTag => oldTag.id === tag.id);
                if (~index) {
                    this.state.tags.splice(index, 1, tag);
                    this.state.tagIndex[tagId] = tag;
                    this.setState(this.state);
                } else {
                    this.onUpdateTags();
                }
            });
    }
}

export const tagStore = new TagStore();
