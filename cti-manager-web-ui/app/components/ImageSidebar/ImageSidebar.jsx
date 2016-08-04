import React from 'react';
import uuid from 'uuid';
import _ from 'lodash';

export default class ImageSidebar extends React.Component {
    constructor() {
        super();
        this.id = `ImageSidebar-${uuid.v1()}`;
    }

    fireSearch() {
        if (typeof this.props.onSearch === 'function') {
            const searchText = this.refs.searchInput.value,
                  tags       = searchText.split(/\s+/);
            this.props.onSearch(tags);
        }
    }

    renderTagsList() {
        const images = this.props.images;

        if (!images) {
            return null;
        }

        const tagCounts  = images.reduce((previous, current) => {
                  current.metadata.tags.forEach((tag) => {
                      if (previous[tag]) {
                          previous[tag] = previous[tag] + 1;
                      } else {
                          previous[tag] = 1;
                      }
                  });
                  return previous;
              }, {}),
              sortedTags = Object.keys(tagCounts).sort((t1, t2) => {
                  const c1 = tagCounts[t1],
                        c2 = tagCounts[t2];
                  return c1 > c2 ? -1 : c1 < c2 ? 1 : 0;
              });
        return sortedTags.map((tag) => {
            return (
                <li key={tag} className="tags-list-item">{tag}</li>
            );
        });
    }

    render() {
        return (
            <div className="ImageSidebar">
                <div className="sidebar-section search-section">
                    <input id={`${this.id}-search-input`} ref="searchInput" type="search"/>
                    <button className="search-button" onClick={this.fireSearch.bind(this)}>Go</button>
                </div>
                <div className="sidebar-section tags-section">
                    <ul className="tags-list">
                        {this.renderTagsList()}
                    </ul>
                </div>
            </div>
        );
    }
}
