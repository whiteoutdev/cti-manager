import * as DataStore from 'nedb';
import {PromiseDb} from './PromiseDb';

export interface DbFindOptions {
    skip?: number;
    limit?: number;
    sort?: any;
}

export abstract class AbstractCollection<Model, Doc> {
    protected readonly db: PromiseDb;

    public constructor(
        protected readonly originalDb: DataStore,
    ) {
        this.db = new PromiseDb(originalDb);

        this.toModel = this.toModel.bind(this);
        this.toDoc = this.toDoc.bind(this);
    }

    public async insertOne(model: Model): Promise<Model> {
        const doc = this.toDoc(model);
        const inserted = await this.db.insertOne(doc);
        return this.toModel(inserted);
    }

    public async insert(...models: Model[]): Promise<Model[]> {
        const docs = models.map(this.toDoc);
        const inserted = await this.db.insert(...docs);
        return inserted.map(this.toModel);
    }

    public async findOneById(_id: string): Promise<Model> {
        const doc = await this.db.findOne<Doc>({_id});
        return doc && this.toModel(doc);
    }

    public async findOne(query: any): Promise<Model> {
        const doc = await this.db.findOne<Doc>(query);
        return doc && this.toModel(doc);
    }

    public async find(query: any, options?: DbFindOptions): Promise<Model[]> {
        options = {skip: 0, limit: 50, sort: null, ...options};
        const docs = await this.db.find<Doc>(query)
            .skip(options.skip)
            .limit(options.limit)
            .sort(options.sort)
            .exec();
        return (docs || []).map(this.toModel);
    }

    protected abstract toModel(doc: Doc): Model;

    protected abstract toDoc(model: Model): Doc;
}
