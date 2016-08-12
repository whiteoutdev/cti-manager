import React from 'react';
import {Link} from 'react-router';
import uuid from 'uuid';
import {HotKeys} from 'react-hotkeys';
import _ from 'lodash';

import RefluxComponent from '../RefluxComponent/RefluxComponent';
import Spinner from '../Spinner/Spinner.jsx';
import TagEditor from '../TagEditor/TagEditor.jsx';
import AutocompleteInput from '../AutocompleteInput/AutocompleteInput.jsx';

import history from '../../services/history';
import TagStore from '../../stores/TagStore';
import TagActions from '../../actions/TagActions';
import ImagesApi from '../../api/ImagesApi';

export default class ImageSidebar extends RefluxComponent {
    constructor(props) {
        super(props);
        this.id = `ImageSidebar-${uuid.v1()}`;
        this.state = {
            uploadPending: false,
            tagEditMode  : false,
            allTags      : []
        };
        this.listenTo(TagStore, this.onTagsUpdated, (tags) => {
            this.state.allTags = tags
        });
        TagActions.updateTags();
    }

    getTagType(tag) {
        const tagData = _.find(this.state.allTags, (tagData) => {
            return tagData.id === tag;
        });
        return tagData ? tagData.type : '';
    }

    onTagsUpdated(tags) {
        this.setState({
            allTags: tags
        });
    }

    fireUploadComplete() {
        if (typeof this.props.onUploadComplete === 'function') {
            this.props.onUploadComplete();
        }
    }

    fireTagsChange(tags) {
        if (typeof this.props.onTagsChange === 'function') {
            this.setState({
                tagEditMode: false
            }, () => {
                this.props.onTagsChange(tags);
            });
        }
    }

    search() {
        const searchText = this.refs.searchInput.value.trim(),
              tags       = searchText.split(/\s+/),
              tagsString = tags.map((tag) => {
                  return encodeURIComponent(tag.replace(/_/g, ' '));
              }).join();
        history.push(`/images?tags=${tagsString}`);
    }

    canUpload() {
        return !this.refs.fileInput || !this.refs.fileInput.files.length;
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

    handleEditTags() {
        this.setState({
            tagEditMode: true
        });
    }

    renderSearchSection() {
        return (
            <div className="sidebar-section search-section">
                <HotKeys handlers={{enter: this.search.bind(this)}}>
                    <div className="section-header">
                        <h2>Search</h2>
                    </div>
                    <div className="section-body">
                        <div className="search-form">
                            <AutocompleteInput ref="searchInput"
                                               items={this.state.allTags.map(tag => tag.id)}
                                               onEnter={this.search.bind(this)}/>
                            <button className="search-button accent" onClick={this.search.bind(this)}>
                                <i className="material-icons">search</i>
                            </button>
                        </div>
                    </div>
                </HotKeys>
            </div>
        );
    }

    renderUploadSection() {
        if (!this.props.uploadDisabled) {
            let uploadText = 'Choose a file...';
            if (this.refs.fileInput && this.refs.fileInput.files.length) {
                uploadText = `${this.refs.fileInput.files.length} files selected`;
            }
            return (
                <div className="sidebar-section upload-section">
                    <div className="section-header">
                        <h2>Upload</h2>
                    </div>
                    <div className="section-body">
                        <div className={`upload-form ${this.state.uploadPending ? 'upload-pending' : ''}`}>
                            <div className="input-container">
                                <input id={`${this.id}-upload-input`}
                                       ref="fileInput"
                                       className="upload-input"
                                       type="file"
                                       multiple
                                       onChange={() => {this.forceUpdate()}}/>
                                <label htmlFor={`${this.id}-upload-input`} className="button upload-input-label">
                                    <i className="material-icons">file_upload</i>
                                    {uploadText}
                                </label>
                            </div>
                            <button className="upload-button accent"
                                    onClick={this.uploadImages.bind(this)}
                                    disabled={this.canUpload()}>
                                Upload
                            </button>
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
        let editIcon = null;
        if (this.props.tagsEditable && !this.state.tagEditMode) {
            editIcon = <i className="material-icons" onClick={this.handleEditTags.bind(this)}>edit</i>;
        }

        let body = null;
        if (this.state.tagEditMode) {
            body = <TagEditor tags={this.getTagList()} onSave={this.fireTagsChange.bind(this)}/>;
        } else {
            body = this.renderTagsList();
        }

        return (
            <div className="sidebar-section tags-section">
                <div className="section-header">
                    <h2>Tags</h2>
                    {editIcon}
                </div>
                <div className="section-body">
                    {body}
                </div>
            </div>
        );
    }

    getTagList() {
        const images = this.props.images;

        if (!images) {
            return null;
        }

        const tagCounts = images.reduce((previous, current) => {
            current.tags.forEach((tag) => {
                if (previous[tag]) {
                    previous[tag] = previous[tag] + 1;
                } else {
                    previous[tag] = 1;
                }
            });
            return previous;
        }, {});

        const tagLimit = Number(this.props.tagLimit) || Infinity;

        return Object.keys(tagCounts).sort((t1, t2) => {
            const c1 = tagCounts[t1],
                  c2 = tagCounts[t2];
            return c1 > c2 ? -1 : c1 < c2 ? 1 : t1 < t2 ? -1 : t1 > t2 ? 1 : 0;
        }).filter((tag, index) => {
            return index < tagLimit;
        });
    }

    renderTagsList() {
        const sortedTags   = this.getTagList(),
              tagListItems = sortedTags.map((tag) => {
                  const tagType = this.getTagType(tag).toLowerCase();
                  return (
                      <li key={tag} className="tags-list-item">
                          <Link className={tagType} to={`/images?tags=${encodeURIComponent(tag)}`}>
                              {tag}
                          </Link>
                      </li>
                  );
              });

        return (
            <ul className="tags-list">
                {tagListItems}
            </ul>
        );
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
