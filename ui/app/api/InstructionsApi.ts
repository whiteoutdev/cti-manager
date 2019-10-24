import {InstructionType} from '../../../service/src/model/instruction/InstructionType';
import appConfig from '../config/app.config';
import AbstractApi from './AbstractApi';

const apiPath = appConfig.api.path;

class InstructionsApi extends AbstractApi {
    public getInstructionTypes(): Promise<InstructionType[]> {
        return this.getData(`${apiPath}/instructionTypes`);
    }
}

export default new InstructionsApi();
