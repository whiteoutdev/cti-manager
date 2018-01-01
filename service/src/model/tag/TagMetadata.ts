import AbstractModel from '../AbstractModel';

export default class TagMetadata extends AbstractModel {
    public static fromDatabase(doc: any): TagMetadata {
        return new TagMetadata(doc.u, doc.p, doc.g, doc.d);
    }

    public static fromApi(metadata: any): TagMetadata {
        return new TagMetadata(metadata.urls, metadata.pixivId, metadata.gelbooruTag, metadata.danbooruTag);
    }

    private urls: string[];
    private pixivId: string;
    private gelbooruTag: string;
    private danbooruTag: string;

    constructor(urls?: string[], pixivId?: string, gelbooruTag?: string, danbooruTag?: string) {
        super(undefined);
        this.urls = urls || [];
        this.pixivId = pixivId || null;
        this.gelbooruTag = gelbooruTag || '';
        this.danbooruTag = danbooruTag || '';
    }

    public serialiseToDatabase(): any {
        return {
            u: this.urls,
            p: this.pixivId,
            g: this.gelbooruTag,
            d: this.danbooruTag
        };
    }

    public serialiseToApi(): any {
        const metadata: any = {
            urls       : this.urls,
            gelbooruTag: this.gelbooruTag,
            danbooruTag: this.danbooruTag
        };
        this.pixivId && (metadata.pixivId = this.pixivId);
        return metadata;
    }
}
