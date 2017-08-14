import MediaApi from '../api/MediaApi';
import StoreWithUser from './StoreWithUser';

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

    public getSupportedMimeTypes(): Promise<void> {
        if (!this.user) {
            return Promise.resolve();
        }

        return MediaApi.getSupportedMimeTypes()
            .then(mimeTypes => this.setState({mimeTypes}));
    }
}

const store = new MediaTypeStore();
export {store as default, store as MediaTypeStore, MediaTypeStoreState};
