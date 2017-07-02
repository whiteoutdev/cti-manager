import {RequestHandler, Router} from 'express';

interface RestApi {
    configure(router: Router, authenticate: RequestHandler): Promise<any>;
}

export default RestApi;
