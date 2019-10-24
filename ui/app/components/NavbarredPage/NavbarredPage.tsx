import * as React from 'react';
import Navbar from '../Navbar/Navbar';

import {ReactElement} from 'react';
import './NavbarredPage.scss';

class NavbarredPage extends React.Component<{}, {}> {
    public render(): ReactElement<{}> {
        return (
            <div className='NavbarredPage'>
                <Navbar/>
                <div className='page-content'>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default NavbarredPage;
