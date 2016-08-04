import React from 'react';
import {Link} from 'react-router';

export default class LandingPage extends React.Component {
    render() {
        return (
            <div className="LandingPage">
                <Link to="/images?tags=foo">Images</Link>
            </div>
        );
    }
};
