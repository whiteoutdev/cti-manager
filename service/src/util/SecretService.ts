import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import appConfig from '../config/app.config';

class SecretService {
    private secretsPath: string;
    private secrets: any = {};
    private secretsPromise: Promise<any>;

    constructor() {
        this.secretsPath = path.resolve(__dirname, '..', '..', appConfig.secretsFile);
        try {
            this.secrets = require(this.secretsPath);
            this.secretsPromise = Promise.resolve(this.secrets);
        } catch (err) {
            this.secretsPromise = new Promise((resolve, reject) => {
                fs.writeFile(this.secretsPath, JSON.stringify(this.secrets), err1 => {
                    if (err1) {
                        reject(err1);
                    }

                    resolve(this.secrets);
                });
            });
        }
    }

    public getSecrets(): Promise<any> {
        return this.secretsPromise;
    }

    public getJwtSecret(): Promise<Buffer> {
        return this.getSecrets()
            .then(secrets => {
                if (secrets.jwt) {
                    return Buffer.from(secrets.jwt, 'hex');
                } else {
                    this.secretsPromise = new Promise((resolve, reject) => {
                        crypto.randomBytes(256, (err, buffer) => {
                            if (err) {
                                reject(err);
                            }

                            this.secrets.jwt = buffer.toString('hex');

                            fs.writeFile(this.secretsPath, JSON.stringify(this.secrets), err1 => {
                                if (err1) {
                                    reject(err1);
                                }

                                resolve(buffer);
                            });
                        });
                    });
                }
            });
    }
}

export default new SecretService();
