interface TeaseConfigSpec {
    slideCount?: number;
    instructionRatio?: number;
}

class TeaseConfig implements TeaseConfigSpec {
    public slideCount?: number;
    public instructionRatio?: number;

    constructor(config: TeaseConfigSpec) {
        this.slideCount = config.slideCount;
        this.instructionRatio = config.instructionRatio;
    }
}

export {TeaseConfigSpec, TeaseConfig, TeaseConfig as default};
