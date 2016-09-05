import _ from 'lodash';

import AbstractFile from './AbstractFile';
import MimeService from '../../util/MimeService';
import FileType from './FileType';

export default class Media extends AbstractFile {
    constructor(fileType, mimeType, hash, thumbnailID, width, height, tags, id) {
        super(fileType, hash, mimeType, id);
        this.hash = hash;
        this.thumbnailID = thumbnailID;
        this.width = width;
        this.height = height;
        this.tags = tags || ['tagme'];

        const extension = MimeService.getFileExtension(this.mimeType);
        if (extension) {
            this.name += `.${extension}`;
        }
    }

    serialiseToDatabase() {
        const serialised = super.serialiseToDatabase();
        return _.extend(serialised, {
            h : this.hash,
            ti: this.thumbnailID,
            w : this.width,
            he: this.height,
            ta: this.tags
        });
    }

    serialiseToApi() {
        const serialised = super.serialiseToApi();
        return _.extend(serialised, {
            hash       : this.hash,
            thumbnailID: this.thumbnailID,
            width      : this.width,
            height     : this.height,
            tags       : this.tags
        });
    }

    static fromDatabase(doc) {
        const md = doc.metadata;
        return new Media(FileType.fromCode(md.t), md.m, md.h, md.ti, md.w, md.he, md.ta, doc._id);
    }
}
