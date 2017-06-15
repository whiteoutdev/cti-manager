import {RequestHandler, Router} from 'express';
import TagCollection from '../store/TagCollection';
import logger from '../util/logger';
import RestApi from './RestApi';

export default class TagsApi implements RestApi {
    public configure(router: Router, authenticate: RequestHandler): Promise<any> {
        router.get('/tags', authenticate, (req, res) => {
            logger.debug('Tags requested');
            const query  = req.query,
                  search = query.query,
                  skip   = Number(query.skip),
                  limit  = Number(query.limit);
            TagCollection.getTags(search, skip, limit).then((tags) => {
                res.status(200).send(tags);
            }).catch((err) => {
                logger.error(err);
                res.status(500).send(err);
            });
        });

        router.get('/tags/:tag', authenticate, (req, res) => {
            const tagName = decodeURIComponent(req.params.tag);
            logger.debug(`Tag ${tagName} requested`);
            TagCollection.getTag(tagName)
                .then((tag) => {
                    if (tag) {
                        res.status(200).send(tag);
                    } else {
                        res.sendStatus(404);
                    }
                })
                .catch((err) => {
                    logger.error(err);
                    res.status(500).send(err);
                });
        });

        router.post('/tags', authenticate, (req, res) => {
            logger.debug('Tag creation requested');
            const tags = req.body.tags.map((tag: string) => {
                return decodeURIComponent(tag);
            });
            TagCollection.createTags(tags).then((tagsCreated) => {
                if (tagsCreated) {
                    res.status(201).send(tagsCreated);
                } else {
                    res.sendStatus(200);
                }
            }).catch((err) => {
                logger.error(err);
                res.status(500).send(err);
            });
        });

        router.post('/tags/:tag', authenticate, (req, res) => {
            const tagId   = decodeURIComponent(req.params.tag),
                  tagData = req.body;
            logger.debug(`Update of tag ${tagId} requested`);
            tagData.id = tagId;
            TagCollection.updateTag(tagData).then(() => {
                res.sendStatus(200);
            }).catch((err) => {
                logger.error(err);
                res.status(500).send(err);
            });
        });

        router.get('/tagtypes', authenticate, (req, res) => {
            logger.debug('Tag types requested');
            res.status(200).send(TagCollection.getTagTypeNames());
        });

        return Promise.resolve();
    }
}
