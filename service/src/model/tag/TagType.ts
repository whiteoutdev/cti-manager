import {AbstractModel} from '../AbstractModel';

export class TagType extends AbstractModel {
    public static fromDatabase(doc: any): TagType {
        return new TagType(doc._id);
    }

    public static fromApi(tagTypeData: any): TagType {
        return new TagType(tagTypeData.id);
    }

    constructor(name: string) {
        super({id: name});
    }

    public serialiseToApi(): any {
        return this.id;
    }
}
