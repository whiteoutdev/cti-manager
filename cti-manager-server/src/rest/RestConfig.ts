import {Router} from 'express';
import {Passport} from 'passport';
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
    public static configure(router: Router, passport: Passport): void {
        apis.forEach((api) => {
            api.configure(router, passport);
        });
    }
}
