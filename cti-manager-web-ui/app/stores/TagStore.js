import Reflux from 'reflux';

import TagActions from '../actions/TagActions';
import TagsApi from '../api/TagsApi';

export default Reflux.createStore({
    init() {
        this.listenTo(TagActions.updateTags, this.onUpdateTags);
        this.tags = [];
        this.onUpdateTags();
    },

    getInitialState() {
        return this.tags;
    },

    onUpdateTags() {
        TagsApi.getTags().then((tags) => {
            this.tags = tags;
            this.trigger(this.tags);
        });
    }
});
