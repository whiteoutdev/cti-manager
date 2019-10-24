import Enum from '../Enum';

enum TagCode {
    GENERAL   = 0,
    COPYRIGHT = 1,
    CHARACTER = 2,
    ARTIST    = 3
}

const keys: string[] = [];
for (const key in TagCode) {
    if (Number(key) >= 0) {
        keys.push(TagCode[key]);
    }
}

class OldTagType implements Enum<TagCode> {
    public static GENERAL = new OldTagType(TagCode.GENERAL);
    public static COPYRIGHT = new OldTagType(TagCode.COPYRIGHT);
    public static CHARACTER = new OldTagType(TagCode.CHARACTER);
    public static ARTIST = new OldTagType(TagCode.ARTIST);

    public static fromCode(code: TagCode): OldTagType {
        return (OldTagType as any)[TagCode[code]];
    }

    public static fromName(name: string): OldTagType {
        return (OldTagType as any)[name];
    }

    public static values(): OldTagType[] {
        if (OldTagType.TYPES) {
            return OldTagType.TYPES;
        } else {
            return (OldTagType.TYPES = keys.map(key => (OldTagType as any)[key]));
        }
    }

    private static TYPES: OldTagType[];

    public name: string;
    public code: TagCode;

    private constructor(code: TagCode) {
        this.name = TagCode[code];
        this.code = code;
    }

    public getName(): string {
        return this.name;
    }

    public getCode(): TagCode {
        return this.code;
    }
}

export {TagCode, OldTagType, OldTagType as default};
