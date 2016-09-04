import React from 'react';
import {Link} from 'react-router';
import uuid from 'uuid';
import {HotKeys} from 'react-hotkeys';
import _ from 'lodash';

import RefluxComponent from '../RefluxComponent/RefluxComponent';
import Spinner from '../Spinner/Spinner.jsx';
import TagEditor from '../TagEditor/TagEditor.jsx';
import AutocompleteInput from '../AutocompleteInput/AutocompleteInput.jsx';
import Panel from '../Panel/Panel.jsx';
import PanelHeader from '../Panel/PanelHeader.jsx';
import PanelBody from '../Panel/PanelBody.jsx';
import PanelList from '../Panel/PanelList.jsx';
import PanelListItem from '../Panel/PanelListItem.jsx';

import history from '../../services/history';
import TagService from '../../services/TagService';
import TagStore from '../../stores/TagStore';
import TagActions from '../../actions/TagActions';
import ImagesApi from '../../api/ImagesApi';

import './ImageSidebar.scss';

const acceptedImageMimeTypes = [
          'image/jpeg',
          'image/pjpeg',
          'image/png',
          'image/gif'
      ],
      PropTypes              = React.PropTypes;

class ImageSidebar extends RefluxComponent {
    constructor(props) {
        super(props);
        this.id = `ImageSidebar-${uuid.v1()}`;
        this.state = {
            uploadPending: false,
            tagEditMode  : false,
            allTags      : []
        };
        this.listenTo(TagStore, this.onTagsUpdated, (data) => {
            this.state.allTags = data.tags;
        });
        TagActions.updateTags();
    }

    getTagType(tag) {
        const tagData = _.find(this.state.allTags, (tagData) => {
            return tagData.id === TagService.toTagId(tag);
        });
        return tagData ? tagData.type : '';
    }

    onTagsUpdated(tags) {
        this.setState({
            allTags: tags
        });
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
        const searchText = this.refs.searchInput.value.trim(),
              tags       = searchText.split(/\s+/),
              tagsString = tags.map((tag) => {
                  return encodeURIComponent(tag);
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
                            <AutocompleteInput ref="searchInput" tokenize
                                               items={this.state.allTags.map(tag => tag.id)}
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
            if (this.refs.fileInput && this.refs.fileInput.files.length) {
                uploadText = `${this.refs.fileInput.files.length} files selected`;
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
                                       ref="fileInput"
                                       className="upload-input"
                                       type="file"
                                       multiple
                                       accept={acceptedImageMimeTypes.join(', ')}
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
                    <Link className={`tag-name ${tagType}`} to={`/images?tags=${encodeURIComponent(tag)}`}>
                        {TagService.toDisplayName(tag)}
                    </Link>
                    <Link className={tagType} to={`/tags/${tag}`}>
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
    tagLimit        : PropTypes.number
};

ImageSidebar.defaultProps = {
    onUploadComplete: _.noop,
    onTagsChange    : _.noop,
    uploadDisabled  : false,
    tagsEditable    : false,
    images          : [],
    tagLimit        : Infinity
};

export default ImageSidebar;
