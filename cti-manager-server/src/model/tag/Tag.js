import AbstractModel from '../AbstractModel';
import TagType from './TagType';
import TagMetadata from './TagMetadata';

export default class Tag extends AbstractModel {
    constructor(name, type, derivedTags, metadata) {
        super();
        this.id = Tag.encode(name);
        this.type = type || TagType.GENERAL;
        this.derivedTags = (derivedTags || []).filter(tag => tag);
        this.metadata = metadata || new TagMetadata();
    }

    serialiseToDatabase() {
        return {
            _id: this.id,
            t  : this.type.code,
            d  : this.derivedTags,
            m  : this.metadata.serialiseToDatabase()
        };
    }

    static fromDatabase(doc) {
        return new Tag(doc._id, TagType.fromCode(doc.t), doc.d, TagMetadata.fromDatabase(doc.m));
    }

    serialiseToApi() {
        return {
            id         : this.id,
            type       : this.type.name,
            derivedTags: this.derivedTags,
            metadata   : this.metadata
        };
    }

    static fromApi(tagData) {
        return new Tag(
            tagData.id,
            TagType.fromName(tagData.type),
            tagData.derivedTags,
            TagMetadata.fromApi(tagData.metadata)
        );
    }

    static encode(name) {
        return name.replace(/ /g, '_');
    }
}
