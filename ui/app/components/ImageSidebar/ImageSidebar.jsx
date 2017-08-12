import React from 'react';
import Reflux from 'reflux';
import {Link, withRouter} from 'react-router-dom';
import uuid from 'uuid';
import {HotKeys} from 'react-hotkeys';
import _ from 'lodash';
import PropTypes from 'prop-types';

import Spinner from '../Spinner/Spinner.jsx';
import TagEditor from '../TagEditor/TagEditor.jsx';
import AutocompleteInput from '../AutocompleteInput/AutocompleteInput.jsx';
import Panel from '../Panel/Panel.jsx';
import PanelHeader from '../Panel/PanelHeader.jsx';
import PanelBody from '../Panel/PanelBody.jsx';
import PanelList from '../Panel/PanelList.jsx';
import PanelListItem from '../Panel/PanelListItem.jsx';

import TagService from '../../services/TagService';
import TagStore from '../../stores/TagStore';
import TagActions from '../../actions/TagActions';
import MediaTypeStore from '../../stores/MediaTypeStore';
import MediaApi from '../../api/MediaApi';

import './ImageSidebar.scss';

class ImageSidebar extends Reflux.Component {
    constructor(props) {
        super(props);
        this.id = `ImageSidebar-${uuid.v1()}`;
        this.state = {
            uploadPending: false,
            tagEditMode  : false
        };
        this.stores = [TagStore, MediaTypeStore];
        TagActions.updateTags();
    }

    getTagType(tag) {
        const tagData = _.find(this.state.tags, (tagData) => {
            return tagData.id === TagService.toTagId(tag);
        });
        return tagData ? tagData.type : '';
    }

    fireUploadComplete() {
        this.props.onUploadComplete();
    }

    fireTagsChange(tags) {
        this.setState({
            tagEditMode: false
        }, () => {
            this.props.onTagsChange(tags);
        });
    }

    search() {
        const searchText = this.searchInput.value.trim(),
              tags       = searchText.split(/\s+/),
              tagsString = tags.map((tag) => {
                  return encodeURIComponent(tag);
              }).join();
        this.props.history.push(`/media?tags=${tagsString}`);
    }

    canUpload() {
        return !this.fileInput || !this.fileInput.files.length;
    }

    uploadImages() {
        const files = this.fileInput.files;
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            const file   = files[i],
                  reader = new FileReader();
            reader.readAsDataURL(file);
            formData.append('media', file);
        }
        this.setState({uploadPending: true}, () => {
            MediaApi.uploadFiles(formData).then(() => {
                this.setState({uploadPending: false}, () => {
                    this.fireUploadComplete();
                });
            });
        });
    }

    handleEditTags() {
        this.setState({
            tagEditMode: true
        });
    }

    renderSearchSection() {
        return (
            <Panel className="search-section">
                <HotKeys handlers={{enter: this.search.bind(this)}}>
                    <PanelHeader>
                        <h2>Search</h2>
                    </PanelHeader>

                    <PanelBody>
                        <div className="search-form">
                            <AutocompleteInput ref={input => this.searchInput = input} tokenize
                                               items={this.state.tags.map(tag => tag.id)}
                                               onEnter={this.search.bind(this)}/>
                            <button className="search-button accent" onClick={this.search.bind(this)}>
                                <i className="material-icons">search</i>
                            </button>
                        </div>
                    </PanelBody>
                </HotKeys>
            </Panel>
        );
    }

    renderUploadSection() {
        if (!this.props.uploadDisabled) {
            let uploadText = 'Choose a file...';
            if (this.fileInput && this.fileInput.files.length) {
                uploadText = `${this.fileInput.files.length} files selected`;
            }
            return (
                <Panel className="upload-section">
                    <PanelHeader>
                        <h2>Upload</h2>
                    </PanelHeader>
                    <PanelBody>
                        <div className={`upload-form ${this.state.uploadPending ? 'upload-pending' : ''}`}>
                            <div className="input-container">
                                <input id={`${this.id}-upload-input`}
                                       ref={input => this.fileInput = input}
                                       className="upload-input"
                                       type="file"
                                       multiple
                                       accept={this.state.mimeTypes.join(', ')}
                                       onChange={() => this.forceUpdate()}/>
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
                    </PanelBody>
                </Panel>
            );
        }
    }

    renderTagsSection() {
        const tagList = this.getTagList();
        if ((!tagList || !tagList.length) && !this.props.tagsEditable) {
            return;
        }

        let editIcon = null;
        if (this.props.tagsEditable && !this.state.tagEditMode) {
            editIcon = <i className="material-icons" onClick={this.handleEditTags.bind(this)}>edit</i>;
        }

        let body = null;
        if (this.state.tagEditMode) {
            body = (
                <PanelBody>
                    <TagEditor tags={tagList} onSave={this.fireTagsChange.bind(this)}/>
                </PanelBody>
            );
        } else {
            body = this.renderTagsList(tagList);
        }

        return (
            <Panel className="tags-section">
                <PanelHeader>
                    <h2>Tags</h2>
                    {editIcon}
                </PanelHeader>
                {body}
            </Panel>
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

        const tagLimit = this.props.tagLimit;

        return Object.keys(tagCounts).sort((t1, t2) => {
            const c1 = tagCounts[t1],
                  c2 = tagCounts[t2];
            return c1 > c2 ? -1 : c1 < c2 ? 1 : t1 < t2 ? -1 : t1 > t2 ? 1 : 0;
        }).filter((tag, index) => {
            return index < tagLimit;
        });
    }

    renderTagsList(tagList) {
        const tagListItems = tagList.map((tag) => {
            const tagType = this.getTagType(tag).toLowerCase();
            return (
                <PanelListItem key={tag} className={`tags-list-item ${tagType}`}>
                    <Link className={`tag-name ${tagType}`} to={`/media?tags=${encodeURIComponent(tag)}`}>
                        {TagService.toDisplayName(tag)}
                    </Link>
                    <Link className={tagType} to={`/tags/${encodeURIComponent(tag)}`}>
                        <i className="tag-icon material-icons">edit</i>
                    </Link>
                </PanelListItem>
            );
        });

        return (
            <PanelList className="tags-list">
                {tagListItems}
            </PanelList>
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

ImageSidebar.propTypes = {
    onUploadComplete: PropTypes.func,
    onTagsChange    : PropTypes.func,
    uploadDisabled  : PropTypes.bool,
    tagsEditable    : PropTypes.bool,
    images          : PropTypes.arrayOf(PropTypes.object),
    tagLimit        : PropTypes.number,
    history         : PropTypes.shape({
        push: PropTypes.func.isRequired
    }).isRequired
};

ImageSidebar.defaultProps = {
    onUploadComplete: _.noop,
    onTagsChange    : _.noop,
    uploadDisabled  : false,
    tagsEditable    : false,
    images          : [],
    tagLimit        : Infinity
};

export default withRouter(ImageSidebar);