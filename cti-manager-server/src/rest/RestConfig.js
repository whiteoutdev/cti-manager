import MediaApi from './MediaApi';
import TagsApi from './TagsApi';
import UserApi from './UserApi';

const apis = [
    new MediaApi(),
    new TagsApi(),
    new UserApi()
];

export default class RestConfig {
    static configure(app, passport) {
        apis.forEach((api) => {
            api.configure(app, passport);
        });
    }
}
