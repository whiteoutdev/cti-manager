import React = require('react');
import {ReactNode} from 'react';
import {Link} from 'react-router-dom';

export class ImagesPage extends React.Component {
    public render(): ReactNode {
        return (
            <div className="ImagesPage">
                Images Page
                <Link to="/">Home</Link>
            </div>
        );
    }
}
