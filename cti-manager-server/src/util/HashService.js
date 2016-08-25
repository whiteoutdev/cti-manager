import fs from 'fs';
import crypto from 'crypto';
import toString from 'stream-to-string';

import appConfig from '../config/app.config';

const hashAlgorithm = 'sha256';

export default class HashService {
    static getHash(filePath) {
        return new Promise((resolve, reject) => {
            const hash   = crypto.createHash(hashAlgorithm),
                  stream = fs.createReadStream(filePath);
            stream.on('data', (chunk) => {
                hash.update(chunk, 'utf8');
            });
            stream.on('end', () => {
                resolve(hash.digest('hex'));
            });
        });
    }
}
