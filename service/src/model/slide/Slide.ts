import * as _ from 'lodash';
import {AbstractModel, AbstractModelSpec} from '../AbstractModel';
import SlideType from './SlideType';

interface SlideSpec extends AbstractModelSpec {
    type: SlideType;
}

class Slide extends AbstractModel implements SlideSpec {
    public id: string;
    public type: SlideType;

    constructor(data: SlideSpec) {
        super(data);
        this.type = data.type;
    }

    public serialiseToDatabase(): any {
        const serialised = super.serialiseToDatabase();
        return _.extend(serialised, {

        });
    }

    public serialiseToApi(): any {
        const serialised = super.serialiseToApi();
        return _.extend(serialised, {});
    }
}

export {Slide, Slide as default, SlideSpec};
