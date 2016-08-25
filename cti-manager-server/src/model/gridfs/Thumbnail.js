import AbstractFile from './AbstractFile';
import FileType from './FileType';

export default class Thumbnail extends AbstractFile {
    constructor(name) {
        super(FileType.THUMBNAIL, name);
    }
};
