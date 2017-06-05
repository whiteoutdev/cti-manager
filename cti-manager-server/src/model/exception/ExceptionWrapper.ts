import CTIExceptionType from './CTIExceptionType';
import CTIWarning from "./CTIWarning";
import CTIError from "./CTIError";
import CTIException from "./CTIException";

export default class ExceptionWrapper {
    private data: any;
    private warnings: CTIWarning[];
    private errors: CTIError[];

    constructor(data?: any, warnings?: CTIWarning[], errors?: CTIError[]) {
        this.data = data;
        this.warnings = warnings ? warnings.slice() : [];
        this.errors = errors ? errors.slice() : [];
    }

    addException(exception: CTIException) {
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
