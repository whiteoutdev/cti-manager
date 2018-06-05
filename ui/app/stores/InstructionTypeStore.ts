import {InstructionType} from '../../../service/src/model/instruction/InstructionType';
import InstructionActions from '../actions/InstructionActions';
import InstructionsApi from '../api/InstructionsApi';
import StoreWithUser from './StoreWithUser';

interface InstructionTypeStoreState {
    instructionTypes: InstructionType[];
}

class InstructionTypeStore extends StoreWithUser<InstructionTypeStoreState> {
    constructor() {
        super();
        this.state = Object.assign({}, this.state, {
            instructionTypes: []
        });
        this.listenTo(InstructionActions.updateInstructionTypes,
            this.onUpdateInstructionTypes, this.onUpdateInstructionTypes);
    }

    public onUserSet(): Promise<void> {
        return this.onUpdateInstructionTypes();
    }

    public onUpdateInstructionTypes(): Promise<void> {
        if (!this.user) {
            return Promise.resolve();
        }

        return InstructionsApi.getInstructionTypes()
            .then(instructionTypes => this.setState({instructionTypes}));
    }
}

const store = new InstructionTypeStore();
export {store as default, store as InstructionTypeStore, InstructionTypeStoreState};
