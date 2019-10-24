import Enum from '../../Enum';
import {FileCode} from '../../gridfs/FileType';

enum TeaseActionParameterCode {
    STRING = 0
}

class TeaseActionParameterType implements Enum<TeaseActionParameterCode> {
    public static STRING = new TeaseActionParameterType(TeaseActionParameterCode.STRING);

    public static fromCode(code: FileCode): TeaseActionParameterType {
        return (TeaseActionParameterType as any)[TeaseActionParameterCode[code]];
    }

    public name: string;
    public code: TeaseActionParameterCode;

    private constructor(code: TeaseActionParameterCode) {
        this.name = TeaseActionParameterCode[code];
        this.code = code;
    }
}

export {TeaseActionParameterCode, TeaseActionParameterType, TeaseActionParameterType as default};
