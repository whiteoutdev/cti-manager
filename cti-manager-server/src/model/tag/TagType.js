import _ from 'lodash';

class TagType {
    constructor(name, code) {
        this.name = name;
        this.code = code;
    }

    static fromCode(code) {
        return _.find(TagType, (tagType) => {
            return tagType.code === code;
        });
    }

    static fromName(name) {
        return _.find(TagType, (tagType) => {
            return tagType.name === name;
        });
    }
}

_.extend(TagType, {
    GENERAL  : new TagType('general', 1),
    COPYRIGHT: new TagType('copyright', 2),
    CHARACTER: new TagType('character', 3),
    ARTIST   : new TagType('artist', 4)
});

export default TagType;
