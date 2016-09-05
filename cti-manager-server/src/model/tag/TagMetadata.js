import AbstractModel from '../AbstractModel';

export default class TagMetadata extends AbstractModel {
    constructor(urls, pixivId, gelbooruTag, danbooruTag) {
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

    static fromDatabase(doc) {
        return new TagMetadata(doc.u, doc.p, doc.g, doc.d);
    }

    serialiseToApi() {
        const metadata = {
            urls       : this.urls,
            gelbooruTag: this.gelbooruTag,
            danbooruTag: this.danbooruTag
        };
        this.pixivId && (metadata.pixivId = this.pixivId);
        return metadata;
    }

    static fromApi(metadata) {
        return new TagMetadata(metadata.urls, metadata.pixivId, metadata.gelbooruTag, metadata.danbooruTag);
    }
}
