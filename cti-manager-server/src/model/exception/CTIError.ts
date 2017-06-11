import CTIException from './CTIException';
import CTIExceptionType from './CTIExceptionType';

export default class CTIError extends CTIException {
    constructor(message: string, e?: Error) {
        super(CTIExceptionType.ERROR, message, e);
    }
}
