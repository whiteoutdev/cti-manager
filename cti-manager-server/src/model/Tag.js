import TagType from './TagType';

export default class Tag {
    constructor(name, type) {
        this._id = Tag.encode(name);
        this.type = type || TagType.GENERAL;
        this.derivedTags = [];
    }

    static encode(name) {
        return name.replace(/ /g, '_');
    }
}
