import {RequestHandler, Router} from 'express';
import InstructionsApi from './InstructionsApi';
import MediaApi from './MediaApi';
import RestApi from './RestApi';
import TagsApi from './TagsApi';
import TeaseApi from './TeaseApi';
import UserApi from './UserApi';

const apis: RestApi[] = [
    new MediaApi(),
    new TagsApi(),
    new UserApi(),
    new TeaseApi(),
    new InstructionsApi()
];

export default class RestConfig {
    public static configure(router: Router, authenticate: RequestHandler): Promise<any> {
        return Promise.all(apis.map(api => {
            return api.configure(router, authenticate);
        }));
    }
}
