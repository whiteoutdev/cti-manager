import * as React from 'react';
import {ReactElement} from 'react';
import {RouteComponentProps} from 'react-router';
import {InstructionTypeStoreState} from '../../stores/InstructionTypeStore';
import InstructionsFilters from '../InstructionsFilters/InstructionsFilters';
import NavbarredPage from '../NavbarredPage/NavbarredPage';

interface InstructionsPageRouteParams {
}

interface InstructionsPageProps extends RouteComponentProps<InstructionsPageRouteParams> {
}

interface InstructionsPageState extends InstructionTypeStoreState {
}

class InstructionsPage extends React.Component<InstructionsPageProps, InstructionsPageState> {
    public render(): ReactElement<{}> {
        return (
            <div className='InstructionsPage'>
                <NavbarredPage>
                    <InstructionsFilters/>
                </NavbarredPage>
            </div>
        );
    }
}

export default InstructionsPage;
