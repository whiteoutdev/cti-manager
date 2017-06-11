import FileType from './FileType';
import Media from './Media';

export default class Video extends Media {
    constructor(mimeType: string, hash: string, thumbnailID: string, width: number, height: number, tags?: string[],
                id?: string) {
        super(FileType.VIDEO, mimeType, hash, thumbnailID, width, height, tags, id);
    }
}
