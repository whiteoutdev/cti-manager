import * as _ from 'lodash';
import {AbstractModel, AbstractModelSpec} from '../AbstractModel';
import User from '../user/User';

interface TeaseSpec extends AbstractModelSpec {
    owner: User;
    slideTime: number;
    strokeCount: number;
}

class Tease extends AbstractModel implements TeaseSpec {
    public owner: User;
    public slideTime: number;
    public strokeCount: number;

    constructor(data: TeaseSpec) {
        super(data);
        this.owner = data.owner;
        this.slideTime = data.slideTime;
        this.strokeCount = data.strokeCount;
    }

    public serialiseToApi(): any {
        const serialised = super.serialiseToApi();

        return _.extend(serialised, {
            owner      : this.owner.serialiseToApi(),
            slideTime  : this.slideTime,
            strokeCount: this.strokeCount
        });
    }

    public serialiseToDatabase(): any {
        const serialised = super.serialiseToDatabase();

        return _.extend(serialised, {
            o : this.owner.id,
            st: this.slideTime,
            sc: this.strokeCount
        });
    }
}

export {TeaseSpec, Tease};
