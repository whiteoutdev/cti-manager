import AbstractFile from './AbstractFile';
import FileType from './FileType';

export default class Thumbnail extends AbstractFile {
    constructor(name: string, mimeType: string, id?: string) {
        super(FileType.THUMBNAIL, name, mimeType, id);
    }

    public static fromDatabase(doc: any) {
        const md = doc.metadata;
        return new Thumbnail(md.n, md.m, doc._id);
    }
}
