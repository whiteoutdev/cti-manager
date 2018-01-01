interface AbstractModelSpec {
    id?: string;
}

abstract class AbstractModel implements AbstractModelSpec {
    public id?: string;

    constructor(data: AbstractModelSpec) {
        data = data || {};
        if (data.id) {
            this.id = data.id;
        }
    }

    public getId(): string {
        return this.id;
    }

    public serialiseToDatabase(): any {
        const serialised: any = {};

        if (this.id) {
            serialised._id = this.id;
        }

        return serialised;
    }

    public serialiseToApi(): any {
        const serialised: any = {};

        if (this.id) {
            serialised.id = this.id;
        }

        return serialised;
    }
}

export {AbstractModel, AbstractModel as default, AbstractModelSpec};
