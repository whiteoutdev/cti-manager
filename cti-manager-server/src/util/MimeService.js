import _ from 'lodash';

const mimeToExtensionMappings = {
          'image/jpeg'         : 'jpg',
          'image/pjpeg'        : 'jpg',
          'image/png'          : 'png',
          'image/bmp'          : 'bmp',
          'image/x-windows-bmp': 'bmp',
          'image/gif'          : 'gif',
          'image/svg+xml'      : 'svg',
          'video/webm'         : 'webm',
          'video/mp4'          : 'mp4',
          'video/ogg'          : 'ogv'
      },
      supportedImageMimeTypes = [
          'image/jpeg',
          'image/pjpeg',
          'image/png',
          'image/gif'
      ],
      supportedVideoMimeTypes = [
          'video/webm',
          'video/mp4',
          'video/ogg'
      ],
      supportedMimeTypes      = _.concat(supportedImageMimeTypes, supportedVideoMimeTypes);

export default class MimeService {
    static getFileExtension(mimeType) {
        return mimeToExtensionMappings[mimeType];
    }

    static getSupportedImageTypes() {
        return supportedImageMimeTypes.slice();
    }

    static getSupportedVideoTypes() {
        return supportedVideoMimeTypes.slice();
    }

    static getSupportedMimeTypes() {
        return supportedMimeTypes.slice();
    }
}
