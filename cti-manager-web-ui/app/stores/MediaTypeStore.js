import Reflux from 'reflux';

import UserStore from './UserStore';
import MediaApi from '../api/MediaApi';

export default Reflux.createStore({
    init() {
        this.mimeTypes = [];
        this.user = null;
        this.listenTo(UserStore, this.getSupportedMimeTypes, this.getSupportedMimeTypes);
    },

    getSupportedMimeTypes(user) {
        this.user = this.user || user;

        if (!this.user) {
            return;
        }

        MediaApi.getSupportedMimeTypes()
            .then((mimeTypes) => {
                this.mimeTypes = mimeTypes;
                this.trigger(this.mimeTypes);
            });
    },

    getInitialState() {
        return this.mimeTypes;
    }
});
