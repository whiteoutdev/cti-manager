import logger from '../util/logger';
import RestApi from './RestApi';
import upload from './upload';
import MediaCollection from '../store/MediaCollection';
import TagCollection from '../store/TagCollection';
import ExceptionWrapper from '../model/exception/ExceptionWrapper';
import CTIError from '../model/exception/CTIError';
import MimeService from '../util/MimeService';

export default class MediaApi extends RestApi {
    configure(app) {
        app.post('/media', upload.array('media'), (req, res) => {
            logger.debug(`Media upload request received for ${req.files.length} files`);
            MediaCollection.addMedia(req.files).then((exceptionWrapper) => {
                res.status(200).send(exceptionWrapper);
            });
        });

        app.get('/media', (req, res) => {
            logger.debug(`Media metadata requested`);
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
            MediaCollection.findMedia(tags, skip, limit).then((info) => {
                res.status(200).send(info);
            }).catch((err) => {
                logger.error(err);
                res.status(500).send(err);
            });
        });

        app.get('/media/:mediaIDHex', (req, res) => {
            const mediaIDHex = req.params.mediaIDHex;
            logger.debug(`Media metadata requested for media ID: ${mediaIDHex}`);
            MediaCollection.getMedia(mediaIDHex).then((metadata) => {
                if (metadata) {
                    res.status(200).send(metadata);
                } else {
                    res.sendStatus(404);
                }
            }).catch((err) => {
                logger.error(err);
                res.status(500).send(err);
            });
        });

        app.get('/media/:mediaIDHex/download', (req, res) => {
            const mediaIDHex = req.params.mediaIDHex;
            logger.debug(`Media download requested for media ID: ${mediaIDHex}`);
            MediaCollection.downloadMedia(mediaIDHex).then((data) => {
                MediaApi.downloadFromFileInfo(res, data);
            }).catch((err) => {
                logger.error(err);
                res.status(500).send(err);
            });
        });

        app.get('/media/:mediaIDHex/thumbnail', (req, res) => {
            const mediaIDHex = req.params.mediaIDHex;
            logger.debug(`Media thumbnail requested for media ID: ${mediaIDHex}`);
            MediaCollection.getThumbnail(mediaIDHex).then((thumbnail) => {
                res.status(200).send(thumbnail);
            }).catch((err) => {
                logger.error(err);
                res.status(500).send(err);
            });
        });

        app.get('/media/:mediaIDHex/thumbnail/download', (req, res) => {
            const mediaIDHex = req.params.mediaIDHex;
            logger.debug(`Media thumbnail download requested for media ID: ${mediaIDHex}`);
            MediaCollection.downloadThumbnail(mediaIDHex).then((data) => {
                MediaApi.downloadFromFileInfo(res, data);
            }).catch((err) => {
                logger.error(err);
                res.status(500).send(err);
            });
        });

        app.post('/media/:mediaIDHex/tags', (req, res) => {
            const mediaIDHex = req.params.mediaIDHex,
                  tags       = req.body.tags;
            logger.debug(`Media tags update requested for media ID: ${mediaIDHex}`);
            Promise.all([
                MediaCollection.setTags(mediaIDHex, tags),
                TagCollection.createTags(tags)
            ]).then((results) => {
                const media = results[0];
                if (media) {
                    res.status(200).send(media);
                } else {
                    res.sendStatus(404);
                }
            }).catch((err) => {
                logger.error(err);
                res.status(500).send(err);
            });
        });

        app.get('/mediatypes', (req, res) => {
            res.status(200).send(MimeService.getSupportedMimeTypes());
        });
    }

    static downloadFromFileInfo(res, data) {
        const mimeType = data.doc.mimeType;
        res.set({
            'Content-Type': mimeType
        });

        const downloadStream = data.stream;
        downloadStream.on('error', (err) => {
            const exception        = new CTIError('Download failed', err),
                  exceptionWrapper = new ExceptionWrapper(undefined, undefined, [exception]);
            res.status(500).send(exceptionWrapper);
        });
        data.stream.pipe(res);
    }
}
