import React from 'react';
import uuid from 'uuid';
import {HotKeys} from 'react-hotkeys';

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

    renderSearchSection() {
        return (
            <HotKeys handlers={{enter: this.fireSearch.bind(this)}}>
                <div className="sidebar-section search-section">
                    <div className="section-header">
                        <h2>Search</h2>
                    </div>
                    <div className="section-body">
                        <div className="search-form">
                            <input id={`${this.id}-search-input`} ref="searchInput" type="text"/>
                            <button className="search-button" onClick={this.fireSearch.bind(this)}>
                                <i className="material-icons">search</i>
                            </button>
                        </div>
                    </div>
                </div>
            </HotKeys>
        );
    }

    renderUploadSection() {
        if (!this.props.uploadDisabled) {
            return (
                <div className="sidebar-section upload-section">
                    <div className="section-header">
                        <h2>Upload</h2>
                    </div>
                    <div className="section-body">
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
                </div>
            );
        }
    }

    renderTagsSection() {
        return (
            <div className="sidebar-section tags-section">
                <div className="section-header">
                    <h2>Tags</h2>
                    {this.props.tagsEditable ? <i className="material-icons">edit</i> : null}
                </div>
                <div className="section-body">
                    <ul className="tags-list">
                        {this.renderTagsList()}
                    </ul>
                </div>
            </div>
        );
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
                {this.renderSearchSection()}
                {this.renderUploadSection()}
                {this.renderTagsSection()}
            </div>
        );
    }
}
