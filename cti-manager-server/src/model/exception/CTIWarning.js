import CTIException from './CTIException';
import CTIExceptionType from './CTIExceptionType';

export default class CTIWarning extends CTIException {
    constructor(message, e) {
        super(CTIExceptionType.WARNING, message, e);
    }
}
