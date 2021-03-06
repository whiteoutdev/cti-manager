import AbstractModel from '../AbstractModel';
import TagMetadata from './TagMetadata';
import {TagType} from './TagType';

export default class Tag extends AbstractModel {
    public static fromDatabase(doc: any): Tag {
        return new Tag(doc._id, TagType.fromDatabase(doc.t), doc.d, TagMetadata.fromDatabase(doc.m));
    }

    public static fromApi(tagData: any): Tag {
        return new Tag(
            tagData.id,
            new TagType(tagData.type),
            tagData.derivedTags,
            TagMetadata.fromApi(tagData.metadata)
        );
    }

    public static encode(name: string): string {
        return name.replace(/ /g, '_').toLowerCase();
    }

    private type: TagType;
    private derivedTags: string[];
    private metadata: TagMetadata;

    constructor(name: string, type?: TagType, derivedTags?: string[], metadata?: TagMetadata) {
        super({
            id: Tag.encode(name)
        });
        this.type = type || new TagType('General');
        this.derivedTags = (derivedTags || []).filter(Boolean);
        this.metadata = metadata || new TagMetadata(null, null, this.id, this.id);
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
            t  : this.type.serialiseToDatabase(),
            d  : this.derivedTags,
            m  : this.metadata.serialiseToDatabase()
        };
    }

    public serialiseToApi(): any {
        return {
            id         : this.id,
            type       : this.type.serialiseToApi(),
            derivedTags: this.derivedTags,
            metadata   : this.metadata
        };
    }
}
