import Enum from '../Enum';

enum TagCode {
    GENERAL   = 0,
    COPYRIGHT = 1,
    CHARACTER = 2,
    ARTIST    = 3
}

const keys: string[] = [];
for (let key in TagCode) {
    if (Number(key) >= 0) {
        keys.push(TagCode[key]);
    }
}

class TagType implements Enum<TagCode> {
    public static GENERAL = new TagType(TagCode.GENERAL);
    public static COPYRIGHT = new TagType(TagCode.COPYRIGHT);
    public static CHARACTER = new TagType(TagCode.CHARACTER);
    public static ARTIST = new TagType(TagCode.ARTIST);

    private static TYPES: TagType[];

    public static fromCode(code: TagCode): TagType {
        return (TagType as any)[TagCode[code]];
    }

    public static fromName(name: string): TagType {
        return (TagType as any)[name];
    }

    public static values(): TagType[] {
        if (TagType.TYPES) {
            return TagType.TYPES;
        } else {
            return (TagType.TYPES = keys.map(key => (TagType as any)[key]));
        }
    }

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

export {TagCode, TagType, TagType as default};
