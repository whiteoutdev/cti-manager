import {Express} from 'express';
import {Passport} from 'passport';
import MediaApi from './MediaApi';
import TagsApi from './TagsApi';
import UserApi from './UserApi';

const apis = [
    new MediaApi(),
    new TagsApi(),
    new UserApi()
];

export default class RestConfig {
    public static configure(app: Express, passport: Passport): void {
        apis.forEach((api) => {
            api.configure(app, passport);
        });
    }
}
