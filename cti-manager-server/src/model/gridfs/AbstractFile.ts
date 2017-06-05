import AbstractModel from '../AbstractModel';
import FileType from "./FileType";

export default class AbstractFile extends AbstractModel {
    protected id: string;
    protected fileType: FileType;
    protected name: string;
    protected mimeType: string;

    constructor(fileType: FileType, name: string, mimeType: string, id?: string) {
        super();

        this.fileType = fileType;
        this.name = name;
        this.mimeType = mimeType;

        if (id) {
            this.id = id;
        }
    }


    getId(): string {
        return this.id;
    }

    getFileType(): FileType {
        return this.fileType;
    }

    getName(): string {
        return this.name;
    }

    getMimeType(): string {
        return this.mimeType;
    }

    public serialiseToDatabase(): any {
        return {
            n: this.name,
            m: this.mimeType,
            t: this.fileType.getCode()
        };
    }

    public serialiseToApi(): any {
        const serialised: any = {
            name    : this.name,
            mimeType: this.mimeType,
            type    : this.fileType.getName()
        };

        if (this.id) {
            serialised.id = this.id;
        }

        return serialised;
    }
}
