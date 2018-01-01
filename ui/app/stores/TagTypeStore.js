import StoreWithUser from './StoreWithUser';
import TagActions from '../actions/TagActions';
import TagsApi from '../api/TagsApi';

class TagTypeStore extends StoreWithUser {
    constructor() {
        super();
        this.state = Object.assign({}, this.state, {
            tagTypes: []
        });
        this.listenTo(TagActions.updateTagTypes, this.onUpdateTagTypes, this.onUpdateTagTypes);
    }

    onUserSet() {
        this.onUpdateTagTypes();
    }

    onUpdateTagTypes() {
        if (!this.user) {
            return;
        }

        TagsApi.getTagTypes()
            .then(tagTypes => this.setState({tagTypes}));
    }
}

const store = new TagTypeStore();
export {store as default, store as TagTypeStore};
