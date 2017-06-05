import {Express} from 'express';
import {Passport} from 'passport';

interface RestApi {
    configure(app: Express, passport?: Passport): void;
}

export default RestApi;
