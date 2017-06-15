import AbstractModel from '../AbstractModel';
import TagMetadata from './TagMetadata';
import TagType from './TagType';

export default class Tag implements AbstractModel {
    public static fromDatabase(doc: any): Tag {
        return new Tag(doc._id, TagType.fromCode(doc.t), doc.d, TagMetadata.fromDatabase(doc.m));
    }

    public static fromApi(tagData: any): Tag {
        return new Tag(
            tagData.id,
            TagType.fromName(tagData.type),
            tagData.derivedTags,
            TagMetadata.fromApi(tagData.metadata)
        );
    }

    public static encode(name: string): string {
        return name.replace(/ /g, '_').toLowerCase();
    }

    private id: string;
    private type: TagType;
    private derivedTags: string[];
    private metadata: TagMetadata;

    constructor(name: string, type?: TagType, derivedTags?: string[], metadata?: TagMetadata) {
        this.id = Tag.encode(name);
        this.type = type || TagType.GENERAL;
        this.derivedTags = (derivedTags || []).filter((tag) => tag);
        this.metadata = metadata || new TagMetadata(null, null, this.id, this.id);
    }

    public getId(): string {
        return this.id;
    }

    public getType(): TagType {
        return this.type;
    }

    public getDerivedTags(): string[] {
        return this.derivedTags.slice();
    }

    public getMetadata(): TagMetadata {
        return this.metadata;
    }

    public serialiseToDatabase(): any {
        return {
            _id: this.id,
            t  : this.type.getCode(),
            d  : this.derivedTags,
            m  : this.metadata.serialiseToDatabase()
        };
    }

    public serialiseToApi(): any {
        return {
            id         : this.id,
            type       : this.type.getName(),
            derivedTags: this.derivedTags,
            metadata   : this.metadata
        };
    }
}
