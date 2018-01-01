import StoreWithUser from './StoreWithUser';
import TagActions from '../actions/TagActions';
import TagsApi from '../api/TagsApi';

class TagStore extends StoreWithUser {
    constructor() {
        super();
        this.state = Object.assign({}, this.state, {
            tags    : [],
            tagIndex: {}
        });
        this.listenTo(TagActions.updateTags, this.onUpdateTags);
        this.listenTo(TagActions.updateTag, this.onUpdateTag);
    }

    onUserSet() {
        this.onUpdateTags();
    }

    buildTagIndex(tags) {
        const tagIndex = {};
        tags.forEach(tag => tagIndex[tag.id] = tag);
        return tagIndex;
    }

    onUpdateTags() {
        if (!this.user) {
            return;
        }

        TagsApi.getTags()
            .then((tags) => {
                if (tags instanceof Array) {
                    const tagIndex = this.buildTagIndex(tags);
                    this.setState({tags, tagIndex});
                }
            });
    }

    onUpdateTag(tagId) {
        TagsApi.getTag(tagId)
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

const store = new TagStore();
export {store as default, store as TagStore};
