import AbstractFile from './AbstractFile';
import FileType from './FileType';
import MimeService from '../../util/MimeService';

export default class Image extends AbstractFile {
    constructor(file, hash, thumbnailID) {
        super(FileType.IMAGE, hash);
        this.createFromUpload(file, hash, thumbnailID);
    }

    createFromUpload(file, hash, thumbnailID) {
        this.mimeType = file.mimetype;
        this.hash = hash;
        this.thumbnailID = thumbnailID;
        const extension = MimeService.getFileExtension(this.mimeType);
        if (extension) {
            this.name += `.${extension}`;
        }

        this.tags = ['tagme'];
    }
};
