import AbstractModel from '../AbstractModel';

export default class TagMetadata extends AbstractModel {
    private urls: string[];
    private pixivId: string;
    private gelbooruTag: string;
    private danbooruTag: string;

    constructor(urls?: string[], pixivId?: string, gelbooruTag?: string, danbooruTag?: string) {
        super();
        this.urls = urls || [];
        this.pixivId = pixivId || null;
        this.gelbooruTag = gelbooruTag || '';
        this.danbooruTag = danbooruTag || '';
    }

    serialiseToDatabase() {
        return {
            u: this.urls,
            p: this.pixivId,
            g: this.gelbooruTag,
            d: this.danbooruTag
        };
    }

    static fromDatabase(doc: any) {
        return new TagMetadata(doc.u, doc.p, doc.g, doc.d);
    }

    serialiseToApi() {
        const metadata: any = {
            urls       : this.urls,
            gelbooruTag: this.gelbooruTag,
            danbooruTag: this.danbooruTag
        };
        this.pixivId && (metadata.pixivId = this.pixivId);
        return metadata;
    }

    static fromApi(metadata: any) {
        return new TagMetadata(metadata.urls, metadata.pixivId, metadata.gelbooruTag, metadata.danbooruTag);
    }
}
