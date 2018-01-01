import {AbstractModel, AbstractModelSpec} from '../AbstractModel';
import FileType from './FileType';
import * as _ from 'lodash';

interface AbstractFileSpec extends AbstractModelSpec {
    id?: string;
    fileType: FileType;
    name: string;
    mimeType: string;
}

abstract class AbstractFile extends AbstractModel implements AbstractFileSpec {
    public fileType: FileType;
    public name: string;
    public mimeType: string;

    constructor(fileType: FileType, name: string, mimeType: string, id?: string) {
        super({id});
        this.fileType = fileType;
        this.name = name;
        this.mimeType = mimeType;
    }

    public getId(): string {
        return this.id;
    }

    public getFileType(): FileType {
        return this.fileType;
    }

    public getName(): string {
        return this.name;
    }

    public getMimeType(): string {
        return this.mimeType;
    }

    public serialiseToDatabase(): any {
        const serialised = super.serialiseToDatabase();
        return _.extend(serialised, {
            n: this.name,
            m: this.mimeType,
            t: this.fileType.getCode()
        });
    }

    public serialiseToApi(): any {
        const serialised = super.serialiseToApi();
        return _.extend(serialised, {
            name    : this.name,
            mimeType: this.mimeType,
            type    : this.fileType.getName()
        });
    }
}

export {AbstractFile, AbstractFile as default, AbstractFileSpec};
