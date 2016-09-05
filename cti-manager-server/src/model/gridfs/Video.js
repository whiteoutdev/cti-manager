import Media from './Media';
import FileType from './FileType';

export default class Video extends Media {
    constructor(mimeType, hash, thumbnailID, width, height, tags, id) {
        super(FileType.VIDEO, mimeType, hash, thumbnailID, width, height, tags, id);
    }
}
