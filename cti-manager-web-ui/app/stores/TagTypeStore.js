import Reflux from 'reflux';

import TagActions from '../actions/TagActions';
import TagsApi from '../api/TagsApi';

export default Reflux.createStore({
    init() {
        this.listenTo(TagActions.updateTagTypes, this.onUpdateTagTypes);
        this.tagTypes = [];
        this.onUpdateTagTypes();
    },

    getInitialState() {
        return this.tags;
    },

    onUpdateTagTypes() {
        TagsApi.getTagTypes().then((tagTypes) => {
            this.tagTypes = tagTypes;
            this.trigger(this.tagTypes);
        });
    }
});
