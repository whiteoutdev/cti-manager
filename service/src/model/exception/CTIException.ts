import CTIExceptionType from './CTIExceptionType';

export default class CTIException {
    private type: CTIExceptionType;
    private message: string;
    private e: Error;

    constructor(type: CTIExceptionType, message: string, e?: Error) {
        this.type = type;
        this.message = message;
        this.e = e;
        if (!message && e && e.message) {
            this.message = e.message;
        }
    }

    public getType(): CTIExceptionType {
        return this.type;
    }

    public getMessage(): string {
        return this.message;
    }

    public getError(): Error {
        return this.e;
    }
}
