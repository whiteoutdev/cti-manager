import appConfig from '../config/app.config';
import Tag from '../model/tag/Tag';
import logger from '../util/logger';
import DBConnectionService from './DBConnectionService';
import {TagTypeCollection} from './TagTypeCollection';

export default class TagCollection {
    public static init(): Promise<any> {
        return TagCollection.createTags(['tagme']);
    }

    public static getTags(query?: string, skip?: number, limit?: number): Promise<any[]> {
        const dbQuery: any = {};
        if (query) {
            dbQuery._id = {
                $regex: new RegExp(query)
            };
        }

        return DBConnectionService.getDB().then(db => {
            return db.collection(appConfig.db.tagsCollection)
                .find(dbQuery)
                .skip(skip || 0)
                .limit(limit || 0)
                .toArray()
                .then(tags => {
                    return tags.map(tag => {
                        return Tag.fromDatabase(tag).serialiseToApi();
                    });
                });
        });
    }

    public static getTag(tag: string): Promise<any> {
        tag = Tag.encode(tag);
        return DBConnectionService.getDB().then(db => {
            return db.collection(appConfig.db.tagsCollection).findOne({
                _id: tag
            }).then(doc => {
                if (!doc) {
                    return null;
                }
                return Tag.fromDatabase(doc).serialiseToApi();
            });
        });
    }

    public static getTagTypeNames(): Promise<string[]> {
        return TagTypeCollection.getTagTypes()
            .then(tagTypes => {
                return tagTypes.map(tagType => tagType.id);
            });
    }

    public static createTags(tags: string[]): Promise<string[]> {
        tags = tags.map(tag => Tag.encode(tag));
        const query = {
            _id: {
                $in: tags
            }
        };
        return DBConnectionService.getDB().then(db => {
            return db.collection(appConfig.db.tagsCollection)
                .find(query)
                .toArray()
                .then(docs => {
                    const tagsToInsert = tags.filter(tag => {
                        return !docs.find(doc => {
                            return doc._id === tag;
                        });
                    }).map(tag => {
                        return new Tag(tag).serialiseToDatabase();
                    });
                    if (tagsToInsert.length) {
                        return db.collection(appConfig.db.tagsCollection)
                            .insertMany(tagsToInsert)
                            .then(result => {
                                if (result.result.n) {
                                    logger.debug(`${result.result.n} tags created`);
                                }
                                return tagsToInsert;
                            });
                    }
                    return null;
                });
        });
    }

    public static updateTag(tagData: any): Promise<any> {
        const tag   = Tag.fromApi(tagData),
              query = {_id: tag.getId()},
              doc   = tag.serialiseToDatabase();

        return DBConnectionService.getDB().then(db => {
            return db.collection(appConfig.db.tagsCollection)
                .updateOne(query, doc)
                .then(writeResult => writeResult.result);
        });
    }

    public static getDerivingTags(tagId: string): Promise<any[]> {
        return DBConnectionService.getDB().then(db => {
            return db.collection(appConfig.db.tagsCollection)
                .find({d: tagId})
                .toArray()
                .then(docs => {
                    return docs.map(doc => {
                        return Tag.fromDatabase(doc).serialiseToApi();
                    });
                });
        });
    }
}
