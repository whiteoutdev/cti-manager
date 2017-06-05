import * as _ from 'lodash';
import TagCode from "./TagCode";

export default class TagType {
    private name: string;
    private code: TagCode;

    public static GENERAL = new TagType('general', TagCode.GENERAL);
    public static COPYRIGHT = new TagType('copyright', TagCode.COPYRIGHT);
    public static CHARACTER = new TagType('character', TagCode.CHARACTER);
    public static ARTIST = new TagType('artist', TagCode.ARTIST);

    private static TYPES = [
        TagType.GENERAL,
        TagType.COPYRIGHT,
        TagType.CHARACTER,
        TagType.ARTIST
    ];

    constructor(name: string, code: TagCode) {
        this.name = name;
        this.code = code;
    }

    public getName(): string {
        return this.name;
    }

    public getCode(): TagCode {
        return this.code;
    }

    public static fromCode(code: TagCode): TagType {
        return _.find(TagType.TYPES, tagType => {
            return tagType.code === code;
        });
    }

    public static fromName(name: string): TagType {
        return _.find(TagType.TYPES, tagType => {
            return tagType.name === name;
        });
    }

    public static values(): TagType[] {
        return TagType.TYPES.slice();
    }
}
