interface Media {
    id: string;
    name: string;
    mimeType: string;
    type: string;
    hash: string;
    thumbnailID: string;
    width: number;
    height: number;
    tags: string[]
}

export default Media;
