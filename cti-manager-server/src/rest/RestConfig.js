import ImagesApi from './ImagesApi';
import TagsApi from './TagsApi';

const apis = [
    new ImagesApi(),
    new TagsApi()
];

export default class RestConfig {
    static configure(app) {
        apis.forEach((api) => {
            api.configure(app);
        });
    }
};
