import {RequestHandler, Router} from 'express';
import {InstructionType} from '../model/instruction/InstructionType';
import logger from '../util/logger';
import RestApi from './RestApi';

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

        router.get('/instructionTypes', authenticate, (req, res) => {
            logger.debug('Instruction types requests');

            res.status(200).send(InstructionType.values());
        });

        return Promise.resolve();
    }
}
