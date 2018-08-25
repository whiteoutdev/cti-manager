import {find, noop} from 'lodash';
import * as React from 'react';
import {Component, ReactElement, ReactNode} from 'react';
import {HotKeys} from 'react-hotkeys';
import {Link} from 'react-router-dom';
import * as uuid from 'uuid';
import TagActions from '../../actions/TagActions';
import appConfig from '../../config/app.config';
import {DEFAULT_MEDIA_STATE, MediaState} from '../../redux/media/MediaState';
import {DEFAULT_TAG_STATE, TagState} from '../../redux/tag/TagState';
import {DEFAULT_UPLOAD_STATE, UploadState} from '../../redux/upload/UploadState';
import TagService from '../../services/TagService';
import AutocompleteInput from '../AutocompleteInput/AutocompleteInput';
import {TagAutocompleteConnector} from '../AutocompleteInput/TagAutocompleteConnector';
import Panel from '../Panel/Panel';
import PanelBody from '../Panel/PanelBody';
import PanelHeader from '../Panel/PanelHeader';
import PanelList from '../Panel/PanelList';
import PanelListItem from '../Panel/PanelListItem';
import Spinner from '../Spinner/Spinner';
import TagEditor from '../TagEditor/TagEditor';
import './ImageSidebar.scss';
import {TagEditorConnector} from '../TagEditor/TagEditorConnector';

export interface ImageSidebarProps extends UploadState, TagState, MediaState {
    tagsEditable?: boolean;
    tagList: string[];
    tagLimit?: number;
    uploadDisabled?: boolean;
    onTagsChange?: (tags: string[]) => void;
    onSearch?: (tags: string[]) => void;
    onUpload: (files: FileList) => void;
}

export interface ImageSidebarState {
    tagEditMode: boolean;
}

export class ImageSidebar extends Component<ImageSidebarProps, ImageSidebarState> {
    public static defaultProps: ImageSidebarProps = {
        ...DEFAULT_UPLOAD_STATE,
        ...DEFAULT_TAG_STATE,
        ...DEFAULT_MEDIA_STATE,
        tagsEditable  : false,
        tagList       : [],
        tagLimit      : appConfig.sidebar.tagDisplayLimit,
        uploadDisabled: false,
        onTagsChange  : noop,
        onUpload      : noop,
        onSearch      : noop
    };

    private id = `ImageSidebar-${uuid.v1()}`;
    private searchInput: AutocompleteInput;
    private fileInput: HTMLInputElement;

    constructor(props: ImageSidebarProps) {
        super(props);
        this.state = {
            tagEditMode: false
        };
        TagActions.updateTags();
    }

    public render(): ReactElement<ImageSidebarProps> {
        return (
            <div className='ImageSidebar'>
                {this.renderSearchSection()}
                {this.renderUploadSection()}
                {this.renderTagsSection()}
            </div>
        );
    }

    private getTagType(tag: string): string {
        const tagData = find(this.props.tags, data => {
            return data.id === TagService.toTagId(tag);
        });
        return tagData ? tagData.type : '';
    }

    private fireTagsChange(tags: string[]): void {
        this.setState({tagEditMode: false}, () => this.props.onTagsChange(tags));
    }

    private search(value: string): void {
        const searchText = value.trim(),
              tags       = searchText.split(/\s+/);
        this.props.onSearch(tags);
    }

    private renderSearchSection(): ReactNode {
        return (
            <Panel className='search-section'>
                <HotKeys handlers={{enter: this.search.bind(this)}}>
                    <PanelHeader>
                        <h2>Search</h2>
                    </PanelHeader>

                    <PanelBody>
                        <div className='search-form'>
                            <TagAutocompleteConnector tokenize
                                                      items={this.props.tags.map(tag => tag.id)}
                                                      onEnter={this.search.bind(this)}/>
                            <button className='search-button accent' onClick={this.search.bind(this)}>
                                <i className='material-icons'>search</i>
                            </button>
                        </div>
                    </PanelBody>
                </HotKeys>
            </Panel>
        );
    }

    private renderUploadSection(): ReactNode {
        if (this.props.uploadDisabled) {
            return;
        }

        let uploadText = 'Choose a file...';
        if (this.fileInput && this.fileInput.files.length) {
            uploadText = `${this.fileInput.files.length} files selected`;
        }
        return (
            <Panel className='upload-section'>
                <PanelHeader>
                    <h2>Upload</h2>
                </PanelHeader>
                <PanelBody>
                    <div className={`upload-form ${this.props.uploadPending ? 'upload-pending' : ''}`}>
                        <div className='input-container'>
                            <input id={`${this.id}-upload-input`}
                                   ref={input => this.fileInput = input}
                                   className='upload-input'
                                   type='file'
                                   multiple
                                   accept={this.props.mimeTypes.join(', ')}
                                   onChange={() => this.forceUpdate()}/>
                            <label htmlFor={`${this.id}-upload-input`} className='button upload-input-label'>
                                <i className='material-icons'>file_upload</i>
                                {uploadText}
                            </label>
                        </div>
                        <button className='upload-button accent'
                                onClick={() => this.props.onUpload(this.fileInput.files)}
                                disabled={!this.fileInput || !this.fileInput.files.length}>
                            Upload
                        </button>
                        <div className='upload-spinner'>
                            <span className='uploading'>
                                <Spinner/>
                                Uploading...
                            </span>
                        </div>
                    </div>
                </PanelBody>
            </Panel>
        );
    }

    private renderTagsSection(): ReactNode {
        if ((!this.props.tagList || !this.props.tagList.length) && !this.props.tagsEditable) {
            return;
        }

        let editIcon = null;
        if (this.props.tagsEditable && !this.state.tagEditMode) {
            editIcon = <i className='material-icons' onClick={() => this.setState({tagEditMode: true})}>edit</i>;
        }

        let body = null;
        if (this.state.tagEditMode) {
            body = (
                <PanelBody>
                    <TagEditorConnector tags={this.props.tagList} onSave={this.fireTagsChange.bind(this)}/>
                </PanelBody>
            );
        } else {
            body = this.renderTagsList(this.props.tagList);
        }

        return (
            <Panel className='tags-section'>
                <PanelHeader>
                    <h2>Tags</h2>
                    {editIcon}
                </PanelHeader>
                {body}
            </Panel>
        );
    }

    private renderTagsList(tagList: string[]): ReactNode {
        const tagListItems = tagList
            .slice(0, this.props.tagLimit)
            .map(tag => {
                const tagType = this.getTagType(tag).toLowerCase();
                return (
                    <PanelListItem key={tag} className={`tags-list-item ${tagType}`}>
                        <Link className={`tag-name ${tagType}`} to={`/media?tags=${encodeURIComponent(tag)}`}>
                            {TagService.toDisplayName(tag)}
                        </Link>
                        <Link className={tagType} to={`/tags/${encodeURIComponent(tag)}`}>
                            <i className='tag-icon material-icons'>edit</i>
                        </Link>
                    </PanelListItem>
                );
            });

        return (
            <PanelList className='tags-list'>
                {tagListItems}
            </PanelList>
        );
    }
}

export default ImageSidebar;
