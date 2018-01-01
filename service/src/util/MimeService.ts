import * as _ from 'lodash';
import {Map} from './Collections';

const mimeToExtensionMappings: Map<string> = {
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
      supportedImageMimeTypes: string[]    = [
          'image/jpeg',
          'image/pjpeg',
          'image/png',
          'image/gif'
      ],
      supportedVideoMimeTypes: string[]    = [
          'video/webm',
          'video/mp4',
          'video/ogg'
      ],
      supportedMimeTypes: string[]         = _.concat(supportedImageMimeTypes, supportedVideoMimeTypes);

export default class MimeService {
    public static getFileExtension(mimeType: string): string {
        return mimeToExtensionMappings[mimeType];
    }

    public static getSupportedImageTypes(): string[] {
        return supportedImageMimeTypes.slice();
    }

    public static getSupportedVideoTypes(): string[] {
        return supportedVideoMimeTypes.slice();
    }

    public static getSupportedMimeTypes(): string[] {
        return supportedMimeTypes.slice();
    }
}
