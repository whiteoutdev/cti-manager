import AbstractFile from './AbstractFile';
import FileType from './FileType';

export default class Thumbnail extends AbstractFile {
    public static fromDatabase(doc: any): Thumbnail {
        const md = doc.metadata;
        return new Thumbnail(md.n, md.m, doc._id);
    }

    constructor(name: string, mimeType: string, id?: string) {
        super(FileType.THUMBNAIL, name, mimeType, id);
    }
}
