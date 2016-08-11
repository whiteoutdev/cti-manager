import AbstractModel from './AbstractModel';
import TagType from './TagType';

export default class Tag extends AbstractModel {
    constructor(name, type, derivedTags) {
        super();
        this.id = Tag.encode(name);
        this.type = type || TagType.GENERAL;
        this.derivedTags = derivedTags || [];
    }

    serialiseToDatabase() {
        return {
            _id: this.id,
            t  : this.type.code,
            d  : this.derivedTags
        };
    }

    static fromDatabase(doc) {
        return new Tag(doc._id, TagType.fromCode(doc.t), doc.d);
    }

    serialiseToApi() {
        return {
            id         : this.id,
            type       : this.type.name,
            derivedTags: this.derivedTags
        };
    }

    static encode(name) {
        return name.replace(/ /g, '_');
    }
}
