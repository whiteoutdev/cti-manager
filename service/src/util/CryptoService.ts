import * as bcrypt from 'bcrypt-nodejs';
import * as crypto from 'crypto';
import * as fs from 'fs';

const hashAlgorithm = 'sha256';

export default class CryptoService {
    public static getHash(filePath: string): Promise<string> {
        return new Promise((resolve: (hash: string) => any) => {
            const hash   = crypto.createHash(hashAlgorithm),
                  stream = fs.createReadStream(filePath);
            stream.on('data', (chunk: string) => {
                hash.update(chunk, 'utf8');
            });
            stream.on('end', () => {
                resolve(hash.digest('hex'));
            });
        });
    }

    public static hashPassword(password: string): string {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
    }

    public static validatePassword(password: string, hash: string): boolean {
        return bcrypt.compareSync(password, hash);
    }
}
