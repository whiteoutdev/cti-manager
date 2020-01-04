export interface ImageDocument {
    readonly _id: string;
    readonly path: string;
    readonly mimeType: string;
}

export interface Image {
    readonly id?: string;
    readonly path: string;
    readonly mimeType: string;
}

export interface ImageRequest {
    path: string;
}
