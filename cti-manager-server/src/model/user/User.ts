import AbstractModel from '../AbstractModel';

export default class User implements AbstractModel {
    public static fromDatabase(doc: any): User {
        return new User(doc.u, doc.p, doc.a, doc._id);
    }

    private id: string;
    private username: string;
    private password: string;
    private admin: boolean;

    constructor(username: string, password: string, admin?: boolean, id?: string) {
        this.username = username;
        this.password = password;
        this.admin = admin || false;

        if (id) {
            this.id = id;
        }
    }

    public getUsername(): string {
        return this.username;
    }

    public getPassword(): string {
        return this.password;
    }

    public getId(): string {
        return this.id;
    }

    public serialiseToDatabase(): any {
        const serialised: any = {
            u: this.username,
            p: this.password,
            a: this.admin
        };

        if (this.id) {
            serialised.id = this.id;
        }

        return serialised;
    }

    public serialiseToApi(): any {
        const serialised: any = {
            username: this.username
        };

        if (this.admin) {
            serialised.admin = true;
        }

        return serialised;
    }
}
