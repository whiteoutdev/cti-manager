import path from 'path';
import del from 'del';

import logger from '../util/logger';
import RestApi from './RestApi'
import upload from './upload';
import ImageCollection from '../store/ImageCollection';

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
            ImageCollection.getImages(skip, limit).then((docs) => {
                res.status(200).send(docs);
            });
        });

        app.get('/images/:imageIDHex/download', (req, res) => {
            const imageIDHex = req.params.imageIDHex;
            logger.debug(`Image Download requested for image ID: ${imageIDHex}`);
            ImageCollection.downloadImage(imageIDHex).then((imageInfo) => {
                res.sendFile(imageInfo.path, {
                    root: path.resolve(__dirname, '../..')
                }, (err) => {
                    if (err) {
                        res.sendStatus(500);
                    }
                    del([imageInfo.path]).then(() => {
                        logger.debug(`Deleted temporary file: ${imageInfo.path}`);
                    });
                });
            });
        });

        app.get('/images/:imageIDHex', (req, res) => {
            const imageIDHex = req.params.imageIDHex;
            logger.debug(`Image metadata requested for image ID: ${imageIDHex}`);
            ImageCollection.getImage(imageIDHex).then((imageMetadata) => {
                res.status(200).send(imageMetadata);
            });
        });
    }
}
