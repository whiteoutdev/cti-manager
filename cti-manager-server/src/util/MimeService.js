const mimeToExtensionMappings = {
    'image/jpeg'         : 'jpg',
    'image/pjpeg'        : 'jpg',
    'image/png'          : 'png',
    'image/bmp'          : 'bmp',
    'image/x-windows-bmp': 'bmp',
    'image/gif'          : 'gif',
    'image/svg+xml'      : 'svg'
};

export default class MimeService {
    static getFileExtension(mimeType) {
        return mimeToExtensionMappings[mimeType];
    }
}
