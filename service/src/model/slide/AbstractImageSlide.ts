import * as _ from 'lodash';
import {Slide, SlideSpec} from './Slide';

interface AbstractImageSlideSpec extends SlideSpec {
    imageId: string;
}

abstract class AbstractImageSlide extends Slide implements AbstractImageSlideSpec {
    public imageId: string;

    constructor(data: AbstractImageSlideSpec) {
        super(data);
        this.imageId = data.imageId;
    }

    public serialiseToDatabase(): any {
        const serialised = super.serialiseToDatabase();
        _.extend(serialised, {
            im: this.imageId
        });
    }
}
