import MediaApi from './MediaApi';
import TagsApi from './TagsApi';

const apis = [
    new MediaApi(),
    new TagsApi()
];

export default class RestConfig {
    static configure(app) {
        apis.forEach((api) => {
            api.configure(app);
        });
    }
}
