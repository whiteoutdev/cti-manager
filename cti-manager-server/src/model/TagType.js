import _ from 'lodash';

class TagType {
    constructor(name, code) {
        this.name = name;
        this.code = code;
    }
}

export default {
    GENERAL  : new TagType('general', 1),
    COPYRIGHT: new TagType('copyright', 2),
    CHARACTER: new TagType('character', 3),
    ARTIST   : new TagType('artist', 4),

    fromCode(code) {
        return _.find(this, (tagType) => {
            return tagType.code === code;
        });
    }
};
