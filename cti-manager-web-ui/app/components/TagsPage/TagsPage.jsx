import React from 'react';

import NavbarredPage from '../NavbarredPage/NavbarredPage.jsx';
import TagsSidebar from '../TagsSidebar/TagsSidebar.jsx';

import './TagsPage.scss';

export default class TagsPage extends React.Component {
    render() {
        return (
            <div className="TagsPage">
                <NavbarredPage>
                    <TagsSidebar/>
                </NavbarredPage>
            </div>
        );
    }
}
