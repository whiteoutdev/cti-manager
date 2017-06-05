import Media from './Media';
import FileType from './FileType';

export default class Video extends Media {
    constructor(mimeType: string, hash: string, thumbnailID: string, width: number, height: number, tags?: string[],
                id?: string) {
        super(FileType.VIDEO, mimeType, hash, thumbnailID, width, height, tags, id);
    }
}
