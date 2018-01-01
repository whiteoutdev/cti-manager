import Enum from '../Enum';

enum FileCode {
    IMAGE     = 0,
    THUMBNAIL = 1,
    VIDEO     = 2
}

class FileType implements Enum<FileCode> {
    public static IMAGE = new FileType(FileCode.IMAGE);
    public static THUMBNAIL = new FileType(FileCode.THUMBNAIL);
    public static VIDEO = new FileType(FileCode.VIDEO);

    public static fromCode(code: FileCode): FileType {
        return (FileType as any)[FileCode[code]];
    }

    public name: string;
    public code: FileCode;

    private constructor(code: FileCode) {
        this.name = FileCode[code];
        this.code = code;
    }

    public getName(): string {
        return this.name;
    }

    public getCode(): FileCode {
        return this.code;
    }
}

export {FileCode, FileType, FileType as default};
