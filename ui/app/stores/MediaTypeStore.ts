import StoreWithUser from './StoreWithUser';
import MediaApi from '../api/MediaApi';

interface MediaTypeStoreState {
    mimeTypes?: string[];
}

class MediaTypeStore extends StoreWithUser<MediaTypeStoreState> {
    constructor() {
        super();
        this.state = Object.assign({}, this.state, {
            mimeTypes: []
        });
    }

    getSupportedMimeTypes() {
        if (!this.user) {
            return;
        }

        MediaApi.getSupportedMimeTypes()
            .then(mimeTypes => this.setState({mimeTypes}));
    }
}

const store = new MediaTypeStore();
export {store as default, store as MediaTypeStore, MediaTypeStoreState};
