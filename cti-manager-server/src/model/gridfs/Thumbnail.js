import AbstractFile from './AbstractFile';
import FileType from './FileType';

export default class Thumbnail extends AbstractFile {
    constructor(name, mimeType, id) {
        super(FileType.THUMBNAIL, name, mimeType, id);
    }

    static fromDatabase(doc) {
        const md = doc.metadata;
        return new Thumbnail(md.n, md.m, doc._id);
    }
};
