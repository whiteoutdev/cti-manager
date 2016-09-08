import Media from './Media';
import FileType from './FileType';

export default class Image extends Media {
    constructor(mimeType, hash, thumbnailID, width, height, tags, id) {
        super(FileType.IMAGE, mimeType, hash, thumbnailID, width, height, tags, id);
    }
}
