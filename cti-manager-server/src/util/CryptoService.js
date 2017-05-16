import fs from 'fs';
import crypto from 'crypto';
import bcrypt from 'bcrypt-nodejs';

const hashAlgorithm = 'sha256';

export default class CryptoService {
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

    static hashPassword(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    }

    static validatePassword(password, hash) {
        return bcrypt.compareSync(password, hash);
    }
}
