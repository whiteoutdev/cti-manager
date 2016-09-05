import Reflux from 'reflux';

import MediaApi from '../api/MediaApi';

export default Reflux.createStore({
    init() {
        this.mimeTypes = [];
        MediaApi.getSupportedMimeTypes().then((mimeTypes) => {
            this.mimeTypes = mimeTypes;
            this.trigger(this.mimeTypes);
        });
    },

    getInitialState() {
        return this.mimeTypes;
    }
});
