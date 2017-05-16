import AbstractModel from '../AbstractModel';

export default class AbstractFile extends AbstractModel {
    constructor(fileType, name, mimeType, id) {
        super();

        this.fileType = fileType;
        this.name = name;
        this.mimeType = mimeType;

        if (id) {
            this.id = id;
        }
    }

    serialiseToDatabase() {
        return {
            n: this.name,
            m: this.mimeType,
            t: this.fileType.code
        };
    }

    serialiseToApi() {
        const serialised = {
            name    : this.name,
            mimeType: this.mimeType,
            type    : this.fileType.name
        };

        if (this.id) {
            serialised.id = this.id;
        }

        return serialised;
    }
}
