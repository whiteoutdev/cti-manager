export default class CTIException {
    constructor(type, message, e) {
        this.type = type;
        this.message = message;
        this.e = e;
        if (!message && e && e.message) {
            this.message = e.message;
        }
    }
}
