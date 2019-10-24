import appConfig from '../config/app.config';
import {TagType} from '../model/tag/TagType';
import logger from '../util/logger';
import DBConnectionService from './DBConnectionService';

export class TagTypeCollection {
    public static init(): Promise<any> {
        const tagTypes: string[] = require(`../../data/tagtypes.${appConfig.preset}.json`);
        return TagTypeCollection.createTagTypes(tagTypes);
    }

    public static getTagTypes(): Promise<TagType[]> {
        return DBConnectionService.getDB().then(db => {
            return db.collection(appConfig.db.tagTypesCollection)
                .find()
                .toArray()
                .then(docs => {
                    return docs.map(doc => TagType.fromDatabase(doc));
                });
        });
    }

    public static createTagTypes(tagTypeNames: string[]): Promise<any[]> {
        const tagTypes = tagTypeNames.map(name => new TagType(name));
        return DBConnectionService.getDB().then(db => {
            return db.collection(appConfig.db.tagTypesCollection)
                .insertMany(tagTypes.map(tagType => tagType.serialiseToDatabase()))
                .then(result => {
                    if (result.result.n) {
                        logger.debug(`${result.result.n} tag types created`);
                    }
                    return result.ops.map(doc => TagType.fromDatabase(doc).serialiseToApi());
                });
        });
    }
}
