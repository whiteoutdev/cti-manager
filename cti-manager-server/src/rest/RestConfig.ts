import {Router} from 'express';
import {Passport} from 'passport';
import MediaApi from './MediaApi';
import TagsApi from './TagsApi';
import UserApi from './UserApi';
import RestApi from './RestApi';

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
