import _ from 'lodash';

import appConfig from '../config/app.config';
import logger from '../util/logger';
import DBConnectionService from './DBConnectionService';
import Tag from '../model/tag/Tag';
import TagType from '../model/tag/TagType';

export default class TagCollection {
    static init() {
        return TagCollection.createTags(['tagme']);
    }

    static getTags(query, skip, limit) {
        const dbQuery = {};
        if (query) {
            dbQuery._id = {
                $regex: new RegExp(query)
            };
        }

        return DBConnectionService.getDB().then((db) => {
            return db.collection(appConfig.db.tagsCollection)
                .find(dbQuery)
                .skip(skip || 0)
                .limit(limit || 0)
                .toArray()
                .then((tags) => {
                    return tags.map((tag) => {
                        return Tag.fromDatabase(tag).serialiseToApi();
                    });
                });
        });
    }

    static getTag(tag) {
        tag = Tag.encode(tag);
        return DBConnectionService.getDB().then((db) => {
            return db.collection(appConfig.db.tagsCollection).findOne({
                _id: tag
            }).then((doc) => {
                if (!doc) {
                    return null;
                }
                return Tag.fromDatabase(doc).serialiseToApi();
            });
        });
    }

    static getTagTypeNames() {
        return _.filter(TagType, (type) => {
            return type instanceof TagType;
        }).map((type) => {
            return type.name;
        });
    }

    static createTags(tags) {
        tags = tags.map(tag => Tag.encode(tag));
        const query = {
            _id: {
                $in: tags
            }
        };
        return DBConnectionService.getDB().then((db) => {
            return db.collection(appConfig.db.tagsCollection)
                .find(query)
                .toArray()
                .then((docs) => {
                    const tagsToInsert = tags.filter((tag) => {
                        return !docs.find((doc) => {
                            return doc._id === tag;
                        });
                    }).map((tag) => {
                        return new Tag(tag).serialiseToDatabase();
                    });
                    if (tagsToInsert.length) {
                        return db.collection(appConfig.db.tagsCollection)
                            .insertMany(tagsToInsert)
                            .then((result) => {
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

    static updateTag(tagData) {
        const tag   = Tag.fromApi(tagData),
              query = {_id: tag.id},
              doc   = tag.serialiseToDatabase();

        return DBConnectionService.getDB().then((db) => {
            return db.collection(appConfig.db.tagsCollection)
                .updateOne(query, doc)
                .then(writeResult => writeResult.result);
        });
    }

    static getDerivingTags(tagId) {
        return DBConnectionService.getDB().then((db) => {
            return db.collection(appConfig.db.tagsCollection)
                .find({d: tagId})
                .toArray()
                .then((docs) => {
                    return docs.map((doc) => {
                        return Tag.fromDatabase(doc).serialiseToApi();
                    });
                });
        });
    }
}
