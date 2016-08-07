import appConfig from '../config/app.config';
import logger from '../util/logger';
import DBConnectionService from './DBConnectionService';
import Tag from '../model/Tag';

export default class TagCollection {
    static init() {
        return TagCollection.createTags(['tagme']);
    }

    static getTags(skip, limit) {
        return DBConnectionService.getDB().then((db) => {
            return db.collection(appConfig.db.tagsCollection)
                .find({})
                .skip(skip || 0)
                .limit(limit || 0)
                .toArray();
        });
    }

    static getTag(tag) {
        tag = Tag.encode(tag);
        return DBConnectionService.getDB().then((db) => {
            return db.collection(appConfig.db.tagsCollection).findOne({
                _id: tag
            }).then(doc => doc);
        });
    }

    static createTags(tags) {
        tags = tags.map(tag => Tag.encode(tag).toLowerCase());
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
                        return new Tag(tag);
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
        })
    }
}
