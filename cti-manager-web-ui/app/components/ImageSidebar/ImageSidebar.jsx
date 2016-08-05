import React from 'react';
import uuid from 'uuid';

import Spinner from '../Spinner/Spinner.jsx';

import ImagesApi from '../../api/ImagesApi';

export default class ImageSidebar extends React.Component {
    constructor() {
        super();
        this.id = `ImageSidebar-${uuid.v1()}`;
        this.state = {
            uploadPending: false
        };
    }

    fireSearch() {
        if (typeof this.props.onSearch === 'function') {
            const searchText = this.refs.searchInput.value,
                  tags       = searchText.split(/\s+/);
            this.props.onSearch(tags);
        }
    }

    fireUploadComplete() {
        if (typeof this.props.onUploadComplete === 'function') {
            this.props.onUploadComplete();
        }
    }

    uploadImages() {
        const files = this.refs.fileInput.files;
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            const file   = files[i],
                  reader = new FileReader();
            reader.readAsDataURL(file);
            formData.append('images', file);
        }
        this.setState({uploadPending: true}, () => {
            ImagesApi.uploadFiles(formData).then(() => {
                this.setState({uploadPending: false}, () => {
                    this.fireUploadComplete();
                });
            });
        })
    }

    renderUploadSection() {
        if (!this.props.uploadDisabled) {
            return (
                <div className="sidebar-section upload-section">
                    <h2>Upload</h2>
                    <div className={`upload-form ${this.state.uploadPending ? 'upload-pending' : ''}`}>
                        <input ref="fileInput" type="file" multiple/>
                        <button onClick={this.uploadImages.bind(this)}>Upload</button>
                        <div className="upload-spinner">
                            <span className="uploading">
                                <Spinner/>
                                Uploading...
                            </span>
                        </div>
                    </div>
                </div>
            );
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
                {this.renderUploadSection()}
                <div className="sidebar-section tags-section">
                    <ul className="tags-list">
                        {this.renderTagsList()}
                    </ul>
                </div>
            </div>
        );
    }
}
