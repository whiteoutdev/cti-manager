import React from 'react';
import {Link} from 'react-router';

class LandingPage extends React.Component {
    render() {
        return (
            <div className="LandingPage">
                <Link to="/media">Media</Link>
            </div>
        );
    }
}

export default LandingPage;
