import AbstractFile from './AbstractFile';
import FileType from './FileType';
import MimeService from '../../util/MimeService';

export default class Image extends AbstractFile {
    constructor(file, hash, thumbnailID, width, height) {
        super(FileType.IMAGE, hash);
        this.createFromUpload(file, hash, thumbnailID, width, height);
    }

    createFromUpload(file, hash, thumbnailID, width, height) {
        this.mimeType = file.mimetype;
        this.hash = hash;
        this.thumbnailID = thumbnailID;
        this.width = width;
        this.height = height;
        const extension = MimeService.getFileExtension(this.mimeType);
        if (extension) {
            this.name += `.${extension}`;
        }

        this.tags = ['tagme'];
    }
};
