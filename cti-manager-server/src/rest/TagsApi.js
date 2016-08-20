import logger from '../util/logger';
import RestApi from './RestApi';
import TagCollection from '../store/TagCollection';

export default class TagsApi extends RestApi {
    configure(app) {
        app.get('/tags', (req, res) => {
            const query  = req.query,
                  search = query.query,
                  skip   = Number(query.skip),
                  limit  = Number(query.limit);
            TagCollection.getTags(search, skip, limit).then((tags) => {
                res.status(200).send(tags);
            });
        });

        app.get('/tags/:tag', (req, res) => {
            logger.debug('Tags requested');
            const tag = decodeURIComponent(req.params.tag);
            TagCollection.getTag(tag).then((tag) => {
                if (tag) {
                    res.status(200).send(tag);
                } else {
                    res.sendStatus(404);
                }
            });
        });

        app.post('/tags', (req, res) => {
            logger.debug('Tag creation requested');
            const tags = req.body.tags.map((tag) => {
                return decodeURIComponent(tag);
            });
            TagCollection.createTags(tags).then((tagsCreated) => {
                if (tagsCreated) {
                    res.status(201).send(tagsCreated);
                } else {
                    res.sendStatus(200);
                }
            });
        });

        app.post('/tags/:tag', (req, res) => {
            const tagId   = decodeURIComponent(req.params.tag),
                  tagData = req.body;
            logger.debug(`Update of tag ${tagId} requested`);
            tagData.id = tagId;
            TagCollection.updateTag(tagData).then(() => {
                res.sendStatus(200);
            });
        });

        app.get('/tagtypes', (req, res) => {
            logger.debug('Tag types requested');
            res.status(200).send(TagCollection.getTagTypeNames());
        });
    }
}
