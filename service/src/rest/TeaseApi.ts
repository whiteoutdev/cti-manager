import RestApi from './RestApi';
import {RequestHandler, Router} from 'express';
import {TeaseConfig} from '../model/tease/TeaseConfig';
import logger from '../util/logger';

export default class TeaseApi implements RestApi {
    public configure(router: Router, authenticate: RequestHandler): Promise<any> {
        router.post('/teases', authenticate, (req, res) => {
            logger.debug(`Tease creation requested for user ${req.user.getUsername()}`);
            const teaseConfig = new TeaseConfig(req.body);
            res.status(200).send(teaseConfig);
        });

        return Promise.resolve();
    }
}
