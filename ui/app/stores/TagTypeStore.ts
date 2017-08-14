import TagActions from '../actions/TagActions';
import TagsApi from '../api/TagsApi';
import StoreWithUser from './StoreWithUser';

interface TagTypeStoreState {
    tagTypes: string[];
}

class TagTypeStore extends StoreWithUser<TagTypeStoreState> {
    constructor() {
        super();
        this.state = Object.assign({}, this.state, {
            tagTypes: []
        });
        this.listenTo(TagActions.updateTagTypes, this.onUpdateTagTypes, this.onUpdateTagTypes);
    }

    public onUserSet(): Promise<void> {
        return this.onUpdateTagTypes();
    }

    public onUpdateTagTypes(): Promise<void> {
        if (!this.user) {
            return Promise.resolve();
        }

        return TagsApi.getTagTypes()
            .then(tagTypes => this.setState({tagTypes}));
    }
}

const store = new TagTypeStore();
export {store as default, store as TagTypeStore, TagTypeStoreState};
