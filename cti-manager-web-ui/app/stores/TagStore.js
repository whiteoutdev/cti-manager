import Reflux from 'reflux';
import _ from 'lodash';

import TagActions from '../actions/TagActions';
import TagsApi from '../api/TagsApi';

export default Reflux.createStore({
    init() {
        this.listenTo(TagActions.updateTags, this.onUpdateTags);
        this.listenTo(TagActions.updateTag, this.onUpdateTag);
        this.tags = [];
        this.tagIndex = {};
        this.onUpdateTags();
    },

    getInitialState() {
        return {
            tags    : this.tags,
            tagIndex: this.tagIndex
        };
    },

    buildTagIndex() {
        this.tagIndex = {};
        this.tags.forEach((tag) => {
            this.tagIndex[tag.id] = tag;
        });
    },

    onUpdateTags() {
        TagsApi.getTags().then((tags) => {
            this.tags = tags;
            this.buildTagIndex();
            this.trigger(this.tags, this.tagIndex);
        });
    },

    onUpdateTag(tagId) {
        TagsApi.getTag(tagId).then((tag) => {
            const index = _.findIndex(this.tags, (oldTag) => {
                return oldTag.id === tag.id;
            });
            if (~index) {
                this.tags.splice(index, 1, tag);
                this.tagIndex[tagId] = tag;
                this.trigger(this.tags, this.tagIndex);
            } else {
                this.onUpdateTags();
            }
        });
    }
});
