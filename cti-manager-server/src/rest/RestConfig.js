import ImagesApi from './ImagesApi';

const apis = [
    new ImagesApi()
];

export default class RestConfig {
    static configure(app) {
        apis.forEach((api) => {
            api.configure(app);
        });
    }
};
