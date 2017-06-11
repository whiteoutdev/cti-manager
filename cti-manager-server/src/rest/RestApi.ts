import {Router} from 'express';
import {Passport} from 'passport';

interface RestApi {
    configure(router: Router, passport?: Passport): void;
}

export default RestApi;
