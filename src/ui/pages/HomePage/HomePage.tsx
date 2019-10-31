import {ReactNode} from 'react';
import * as React from 'react';
import {Link} from 'react-router-dom';

export class HomePage extends React.Component {
    public render(): ReactNode {
        return (
            <div className="HomePage">
                Home Page
                <Link to="/images">Images</Link>
            </div>
        );
    }
}
