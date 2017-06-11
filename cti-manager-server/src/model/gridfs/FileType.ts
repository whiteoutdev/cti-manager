import * as _ from 'lodash';
import FileCode from './FileCode';

export default class FileType {
    public static IMAGE = new FileType('image', FileCode.IMAGE);
    public static THUMBNAIL = new FileType('thumbnail', FileCode.THUMBNAIL);
    public static VIDEO = new FileType('video', FileCode.VIDEO);

    public static fromCode(code: FileCode): FileType {
        return _.find(FileType.TYPES, (fileType) => {
            return fileType.code === code;
        });
    }

    private static TYPES = [
        FileType.IMAGE,
        FileType.THUMBNAIL,
        FileType.VIDEO
    ];

    private name: string;
    private code: FileCode;

    constructor(name: string, code: FileCode) {
        this.name = name;
        this.code = code;
    }

    public getName(): string {
        return this.name;
    }

    public getCode(): FileCode {
        return this.code;
    }
}
