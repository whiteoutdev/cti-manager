import CTIError from './CTIError';
import CTIException from './CTIException';
import CTIExceptionType from './CTIExceptionType';
import CTIWarning from './CTIWarning';

export default class ExceptionWrapper {
    private data: any;
    private warnings: CTIWarning[];
    private errors: CTIError[];

    constructor(data?: any, warnings?: CTIWarning[], errors?: CTIError[]) {
        this.data = data;
        this.warnings = warnings ? warnings.slice() : [];
        this.errors = errors ? errors.slice() : [];
    }

    public addException(exception: CTIException): void {
        switch (exception.getType()) {
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
