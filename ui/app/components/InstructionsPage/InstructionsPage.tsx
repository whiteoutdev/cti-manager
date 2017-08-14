import * as React from 'react';
import {ReactElement} from 'react';
import NavbarredPage from '../NavbarredPage/NavbarredPage';

class InstructionsPage extends React.Component<{}, {}> {
    public render(): ReactElement<{}> {
        return (
            <div className='InstructionsPage'>
                <NavbarredPage>
                    Instructions Page
                </NavbarredPage>
            </div>
        );
    }
}

export default InstructionsPage;
