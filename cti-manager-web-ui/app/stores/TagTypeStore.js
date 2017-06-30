import Reflux from 'reflux';

import TagActions from '../actions/TagActions';
import TagsApi from '../api/TagsApi';
import UserStore from './UserStore';

export default Reflux.createStore({
    init() {
        this.tagTypes = [];
        this.listenTo(TagActions.updateTagTypes, this.onUpdateTagTypes);
        this.listenTo(UserStore, this.onUpdateTagTypes, this.onUpdateTagTypes);
    },

    getInitialState() {
        return this.tagTypes;
    },

    onUpdateTagTypes(user) {
        this.user = this.user || user;

        if (!this.user) {
            return;
        }

        TagsApi.getTagTypes().then((tagTypes) => {
            this.tagTypes = tagTypes;
            this.trigger(this.tagTypes);
        });
    }
});
