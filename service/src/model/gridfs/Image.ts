import FileType from './FileType';
import Media from './Media';
import {ObjectID} from 'bson';

export default class Image extends Media {
    constructor(mimeType: string, hash: string, thumbnailID: ObjectID, width: number, height: number, tags?: string[],
                id?: string) {
        super(FileType.IMAGE, mimeType, hash, thumbnailID, width, height, tags, id);
    }
}
