import React from 'react';
import uuid from 'uuid';

export default class ImagesPageSidebar extends React.Component {
    constructor() {
        super();
        this.id = `ImagesPageSidebar-${uuid.v1()}`;
    }

    fireSearch() {
        if (typeof this.props.onSearch === 'function') {
            const searchText = this.refs.searchInput.value,
                  tags       = searchText.split(/\s+/);
            this.props.onSearch(tags);
        }
    }

    render() {
        return (
            <div className="ImagesPageSidebar">
                <div className="sidebar-section search-section">
                    <input id={`${this.id}-search-input`} ref="searchInput" type="search"/>
                    <button className="search-button" onClick={this.fireSearch.bind(this)}>Go</button>
                </div>
                <div className="sidebar-section">

                </div>
            </div>
        );
    }
}
