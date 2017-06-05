import * as _ from 'lodash';
import FileCode from "./FileCode";

export default class FileType {
    private name: string;
    private code: FileCode;

    public static IMAGE = new FileType('image', FileCode.IMAGE);
    public static THUMBNAIL = new FileType('thumbnail', FileCode.THUMBNAIL);
    public static VIDEO = new FileType('video', FileCode.VIDEO);

    private static TYPES = [
        FileType.IMAGE,
        FileType.THUMBNAIL,
        FileType.VIDEO
    ];

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

    public static fromCode(code: FileCode): FileType {
        return _.find(FileType.TYPES, fileType => {
            return fileType.code === code;
        });
    }
}
