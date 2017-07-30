import * as _ from 'lodash';

import MimeService from '../../util/MimeService';
import AbstractFile from './AbstractFile';
import FileType from './FileType';
import {ObjectID} from 'bson';

export default class Media extends AbstractFile {
    public static fromDatabase(doc: any): Media {
        const md = doc.metadata;
        return new Media(FileType.fromCode(md.t), md.m, md.h, md.ti.toHexString(), md.w, md.he, md.ta, doc._id);
    }

    private hash: string;
    private thumbnailID: ObjectID;
    private width: number;
    private height: number;
    private tags: string[];

    constructor(fileType: FileType, mimeType: string, hash: string, thumbnailID: ObjectID, width: number,
                height: number,
                tags?: string[], id?: string) {
        super(fileType, hash, mimeType, id);
        this.hash = hash;
        this.thumbnailID = thumbnailID;
        this.width = width;
        this.height = height;
        this.tags = tags || ['tagme'];

        const extension = MimeService.getFileExtension(this.mimeType);
        if (extension) {
            this.name += `.${extension}`;
        }
    }

    public getHash(): string {
        return this.hash;
    }

    public getThumbnailID(): string {
        return this.thumbnailID.toString();
    }

    public getWidth(): number {
        return this.width;
    }

    public getHeight(): number {
        return this.height;
    }

    public getTags(): string[] {
        return this.tags.slice();
    }

    public serialiseToDatabase(): any {
        const serialised = super.serialiseToDatabase();
        return _.extend(serialised, {
            h : this.hash,
            ti: this.thumbnailID,
            w : this.width,
            he: this.height,
            ta: this.tags
        });
    }

    public serialiseToApi(): any {
        const serialised = super.serialiseToApi();
        return _.extend(serialised, {
            hash       : this.hash,
            thumbnailID: this.thumbnailID.toString(),
            width      : this.width,
            height     : this.height,
            tags       : this.tags
        });
    }
}
