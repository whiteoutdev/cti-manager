import CTIExceptionType from './CTIExceptionType';

export default class ExceptionWrapper {
    constructor(data, warnings, errors) {
        this.data = data;
        this.warnings = warnings ? warnings.slice() : [];
        this.errors = errors ? errors.slice() : [];
    }

    addException(exception) {
        switch (exception.type) {
            case CTIExceptionType.WARNING:
                this.warnings.push(exception);
                break;
            case CTIExceptionType.ERROR:
            default:
                this.errors.push(exception);
                break;
        }
    }
}
