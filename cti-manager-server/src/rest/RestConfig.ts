import MediaApi from './MediaApi';
import TagsApi from './TagsApi';
import UserApi from './UserApi';
import {Express} from 'express';
import {Passport} from 'passport';

const apis = [
    new MediaApi(),
    new TagsApi(),
    new UserApi()
];

export default class RestConfig {
    static configure(app: Express, passport: Passport) {
        apis.forEach((api) => {
            api.configure(app, passport);
        });
    }
}
