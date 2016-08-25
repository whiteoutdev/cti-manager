import logger from '../util/logger';
import RestApi from './RestApi'
import upload from './upload';
import ImageCollection from '../store/ImageCollection';
import TagCollection from '../store/TagCollection';

export default class ImagesApi extends RestApi {
    configure(app) {
        app.post('/images', upload.array('images'), (req, res, next) => {
            logger.debug(`Image upload request received for ${req.files.length} images`);
            ImageCollection.addImages(req.files).then(() => {
                res.status(200).end();
            });
        });

        app.get('/images', (req, res) => {
            logger.debug(`Image metadata requested`);
            const query = req.query,
                  skip  = Number(query.skip),
                  limit = Number(query.limit);
            let tags = null;
            if (query.tags) {
                const tagsString = req.url.match(/tags=([^&]+)/)[1];
                tags = tagsString.split(',').map((encodedTag) => {
                    return decodeURIComponent(encodedTag);
                });
            }
            ImageCollection.getImages(tags, skip, limit).then((info) => {
                res.status(200).send(info);
            });
        });

        app.get('/images/:imageIDHex', (req, res) => {
            const imageIDHex = req.params.imageIDHex;
            logger.debug(`Image metadata requested for image ID: ${imageIDHex}`);
            ImageCollection.getImage(imageIDHex).then((imageMetadata) => {
                if (imageMetadata) {
                    res.status(200).send(imageMetadata);
                } else {
                    res.sendStatus(404);
                }
            });
        });

        app.get('/images/:imageIDHex/download', (req, res) => {
            const imageIDHex = req.params.imageIDHex;
            logger.debug(`Image download requested for image ID: ${imageIDHex}`);
            ImageCollection.downloadImage(imageIDHex).then((data) => {
                this.downloadFromFileInfo(res, data);
            });
        });

        app.get('/images/:imageIDHex/thumbnail', (req, res) => {
            const imageIDHex = req.params.imageIDHex;
            logger.debug(`Image thumbnail requested for image ID: ${imageIDHex}`);
            ImageCollection.getThumbnail(imageIDHex).then((thumbnail) => {
                res.status(200).send(thumbnail);
            });
        });

        app.get('/images/:imageIDHex/thumbnail/download', (req, res) => {
            const imageIDHex = req.params.imageIDHex;
            logger.debug(`Image thumbnail download requested for image ID: ${imageIDHex}`);
            ImageCollection.downloadThumbnail(imageIDHex).then((data) => {
                this.downloadFromFileInfo(res, data);
            });
        });

        app.post('/images/:imageIDHex/tags', (req, res) => {
            const imageIDHex = req.params.imageIDHex,
                  tags       = req.body.tags;
            logger.debug(`Image tags update requested for image ID: ${imageIDHex}`);
            Promise.all([
                ImageCollection.setTags(imageIDHex, tags),
                TagCollection.createTags(tags)
            ]).then((results) => {
                const image = results[0];
                if (image) {
                    res.status(200).send(image);
                } else {
                    res.sendStatus(404);
                }
            }).catch((err) => {
                logger.error(err);
                res.sendStatus(500);
            });
        });
    }

    downloadFromFileInfo(res, data) {
        const mimeType = data.doc.mimeType;
        res.set({
            'Content-Type': mimeType
        });
        data.stream.pipe(res);
    }
}
