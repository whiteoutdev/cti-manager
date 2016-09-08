import fs from 'fs';
import crypto from 'crypto';

const hashAlgorithm = 'sha256';

export default class HashService {
    static getHash(filePath) {
        return new Promise((resolve) => {
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
