import * as React from 'react';
import {ReactNode} from 'react';
import {Link} from 'react-router-dom';
import {NavPage} from '../../components/NavPage/NavPage';

export class HomePage extends React.Component {
    public render(): ReactNode {
        return (
            <NavPage className="HomePage">
                Home Page
                <Link to="/images">Images</Link>
            </NavPage>
        );
    }
}
