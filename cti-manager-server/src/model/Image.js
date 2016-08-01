import MimeService from '../util/MimeService';

export default class Image {
    constructor(file, hash) {
        this.createFromUpload(file, hash);
    }

    createFromUpload(file, hash) {
        this.mimeType = file.mimetype;
        this.hash = hash;

        this.name = this.hash;
        const extension = MimeService.getFileExtension(this.mimeType);
        if (extension) {
            this.name += `.${extension}`;
        }

        this.tags = ['tagme'];
    }

    createFromDBObject() {}
};
