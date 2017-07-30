import Enum from '../Enum';

enum SlideCode {
    IMAGE       = 0,
    INSTRUCTION = 1
}

class SlideType implements Enum<SlideCode> {
    public static IMAGE = new SlideType(SlideCode.IMAGE);
    public static INSTRUCTION = new SlideType(SlideCode.INSTRUCTION);

    public static fromCode(code: SlideCode): SlideType {
        return (SlideType as any)[SlideCode[code]];
    }

    public name: string;
    public code: SlideCode;

    private constructor(code: SlideCode) {
        this.name = SlideCode[code];
        this.code = code;
    }
}

export {SlideCode, SlideType, SlideType as default};
