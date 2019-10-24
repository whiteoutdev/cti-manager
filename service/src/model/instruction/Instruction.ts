import {AbstractModel, AbstractModelSpec} from '../AbstractModel';
import {InstructionType} from './InstructionType';

interface InstructionSpec extends AbstractModelSpec {
    type: InstructionType;
}

class Instruction extends AbstractModel implements InstructionSpec {
    public type: InstructionType;

    constructor(data: InstructionSpec) {
        super(data);
        this.type = data.type;
    }
}
