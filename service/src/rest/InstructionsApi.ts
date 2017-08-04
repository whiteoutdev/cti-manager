import RestApi from './RestApi';
import {RequestHandler, Router} from 'express';
import logger from '../util/logger';

export default class InstructionsApi implements RestApi {
    public configure(router: Router, authenticate: RequestHandler): Promise<any> {
        router.get('/instructions', authenticate, (req, res) => {
            logger.debug('Instructions requested');
            // TODO
            res.status(200).send({count: 0, instructions: []});
        });

        router.post('/instructions', authenticate, (req, res) => {
            logger.debug('Instruction creation requested');
            // TODO
            res.status(200).end();
        });

        return Promise.resolve();
    }
}
