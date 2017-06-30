import {RequestHandler, Router} from 'express';
import MediaApi from './MediaApi';
import RestApi from './RestApi';
import TagsApi from './TagsApi';
import UserApi from './UserApi';

const apis: RestApi[] = [
    new MediaApi(),
    new TagsApi(),
    new UserApi()
];

export default class RestConfig {
    public static configure(router: Router, authenticate: RequestHandler): Promise<any> {
        return Promise.all(apis.map(api => {
            return api.configure(router, authenticate);
        }));
    }
}
