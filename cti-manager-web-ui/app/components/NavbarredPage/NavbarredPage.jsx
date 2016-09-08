import React from 'react';

import Navbar from '../Navbar/Navbar.jsx';

import './NavbarredPage.scss';

class NavbarredPage extends React.Component {
    render() {
        return (
            <div className="NavbarredPage">
                <Navbar/>
                <div className="page-content">
                    {this.props.children}
                </div>
            </div>
        );
    }
}

NavbarredPage.propTypes = {
    children: React.PropTypes.node
};

export default NavbarredPage;
