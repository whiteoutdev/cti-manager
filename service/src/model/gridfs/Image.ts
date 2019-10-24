import {ObjectID} from 'bson';
import FileType from './FileType';
import Media from './Media';

export default class Image extends Media {
    constructor(mimeType: string, hash: string, thumbnailID: ObjectID, width: number, height: number, tags?: string[],
                id?: string) {
        super(FileType.IMAGE, mimeType, hash, thumbnailID, width, height, tags, id);
    }
}
