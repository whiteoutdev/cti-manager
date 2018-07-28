import {AbstractModel} from '../AbstractModel';
import Enum from '../Enum';

enum InstructionCode {
    BONDAGE                = 0,
    CHANCE_TO_CUM          = 1,
    DILEMMA                = 2,
    EDGE                   = 3,
    GETTING_INTO_CHARACTER = 4,
    HUMILIATION            = 5,
    KEY                    = 6,
    MIND_CONTROL           = 7,
    NICE_MISTRESS          = 8,
    ROUGH_MISTRESS         = 9,
    SPECIAL                = 10,
    STROKE_IT              = 11,
    TOY_TIME               = 12,
    WORK_IT                = 13
}

const keys: string[] = [];
for (const key in InstructionCode) {
    if (Number(key) >= 0) {
        keys.push(InstructionCode[key]);
    }
}

class InstructionType extends AbstractModel implements Enum<InstructionCode> {
    public static BONDAGE = new InstructionType(InstructionCode.BONDAGE, 'Bondage');
    public static CHANCE_TO_CUM = new InstructionType(InstructionCode.CHANCE_TO_CUM, 'Chance to Cum');
    public static DILEMMA = new InstructionType(InstructionCode.DILEMMA, 'Dilemma');
    public static EDGE = new InstructionType(InstructionCode.EDGE, 'Edge');
    public static GETTING_INTO_CHARACTER = new InstructionType(InstructionCode.GETTING_INTO_CHARACTER,
        'Getting Into Character');
    public static HUMILIATION = new InstructionType(InstructionCode.HUMILIATION, 'Humiliation');
    public static KEY = new InstructionType(InstructionCode.KEY, 'Key');
    public static MIND_CONTROL = new InstructionType(InstructionCode.MIND_CONTROL, 'Mind Control');
    public static NICE_MISTRESS = new InstructionType(InstructionCode.NICE_MISTRESS, 'Nice Mistress');
    public static ROUGH_MISTRESS = new InstructionType(InstructionCode.ROUGH_MISTRESS, 'Rough Mistress');
    public static SPECIAL = new InstructionType(InstructionCode.SPECIAL, 'Special');
    public static STROKE_IT = new InstructionType(InstructionCode.STROKE_IT, 'Stroke It!');
    public static TOY_TIME = new InstructionType(InstructionCode.TOY_TIME, 'Toy Time');
    public static WORK_IT = new InstructionType(InstructionCode.WORK_IT, 'Work It!');

    public static values(): InstructionType[] {
        if (InstructionType.TYPES) {
            return InstructionType.TYPES;
        } else {
            InstructionType.TYPES = keys.map(key => (InstructionType as any)[key]);
            InstructionType.TYPES.sort((t1, t2) => {
                return t1.name.localeCompare(t2.name);
            });
            return InstructionType.TYPES;
        }
    }

    public static fromCode(code: InstructionCode): InstructionType {
        return (InstructionType as any)[InstructionCode[code]];
    }

    private static TYPES: InstructionType[];

    public name: string;
    public code: InstructionCode;
    public display: string;

    private constructor(code: InstructionCode, display: string) {
        super({});
        this.name = InstructionCode[code];
        this.code = code;
        this.display = display;
    }

    public serialiseToDatabase(): any {
        return this.code;
    }

    public serialiseToApi(): any {
        return {
            name   : this.name,
            display: this.display
        };
    }
}

export {InstructionCode, InstructionType};
