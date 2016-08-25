import AbstractModel from '../AbstractModel';

export default class TagMetadata extends AbstractModel {
    constructor(urls, pixivId) {
        super();
        this.urls = urls || [];
        this.pixivId = pixivId || null;
    }

    serialiseToDatabase() {
        return {
            u: this.urls,
            p: this.pixivId
        };
    }

    static fromDatabase(doc) {
        return new TagMetadata(doc.u, doc.p);
    }

    serialiseToApi() {
        const metadata = {
            urls: this.urls
        };
        this.pixivId && (metadata.pixivId = pixivId);
        return metadata;
    }

    static fromApi(metadata) {
        return new TagMetadata(metadata.urls, metadata.pixivId);
    }
}
