// tslint:disable:max-classes-per-file

import * as _ from 'lodash';
import * as React from 'react';
import {HotKeys} from 'react-hotkeys';
import {Link, withRouter} from 'react-router-dom';
import * as uuid from 'uuid';

import AutocompleteInput from '../AutocompleteInput/AutocompleteInput';
import Panel from '../Panel/Panel';
import PanelBody from '../Panel/PanelBody';
import PanelHeader from '../Panel/PanelHeader';
import PanelList from '../Panel/PanelList';
import PanelListItem from '../Panel/PanelListItem';
import Spinner from '../Spinner/Spinner';
import TagEditor from '../TagEditor/TagEditor';

import TagActions from '../../actions/TagActions';
import MediaApi from '../../api/MediaApi';
import TagService from '../../services/TagService';
import MediaTypeStore, {MediaTypeStoreState} from '../../stores/MediaTypeStore';
import TagStore, {TagStoreState} from '../../stores/TagStore';

import {ReactElement, ReactNode} from 'react';
import {RouteComponentProps} from 'react-router';
import Media from '../../model/media/Media';
import {AbstractRefluxComponent} from '../AbstractComponent/AbstractComponent';
import './ImageSidebar.scss';

interface ImageSidebarBaseProps {
    onUploadComplete?: () => void;
    onTagsChange?: (tags: string[]) => void;
    uploadDisabled?: boolean;
    tagsEditable?: boolean;
    images: Media[];
    tagLimit?: number;
}

interface ImageSidebarProps extends ImageSidebarBaseProps, RouteComponentProps<{}> {
}

interface ImageSidebarState extends TagStoreState, MediaTypeStoreState {
    uploadPending: boolean;
    tagEditMode: boolean;
}

class ImageSidebar extends AbstractRefluxComponent<ImageSidebarProps, ImageSidebarState> {
    private id = `ImageSidebar-${uuid.v1()}`;
    private searchInput: AutocompleteInput;
    private fileInput: HTMLInputElement;

    constructor(props: ImageSidebarProps) {
        super(props);
        this.state = {
            uploadPending: false,
            tagEditMode  : false
        };
        this.stores = [TagStore, MediaTypeStore];
        TagActions.updateTags();
    }

    public getTagType(tag: string): string {
        const tagData = _.find(this.state.tags, data => {
            return data.id === TagService.toTagId(tag);
        });
        return tagData ? tagData.type : '';
    }

    public fireUploadComplete(): void {
        this.getProps().onUploadComplete();
    }

    public fireTagsChange(tags: string[]): void {
        this.setState({
            tagEditMode: false
        }, () => {
            this.getProps().onTagsChange(tags);
        });
    }

    public search(): void {
        const searchText = this.searchInput.value.trim(),
              tags       = searchText.split(/\s+/),
              tagsString = tags.map(tag => {
                  return encodeURIComponent(tag);
              }).join();
        this.getProps().history.push(`/media?tags=${tagsString}`);
    }

    public canUpload(): boolean {
        return !this.fileInput || !this.fileInput.files.length;
    }

    public uploadImages(): void {
        const files = this.fileInput.files;
        const formData = new FormData();
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < files.length; i++) {
            const file   = files[i],
                  reader = new FileReader();
            reader.readAsDataURL(file);
            formData.append('media', file);
        }
        this.setState({uploadPending: true}, () => {
            MediaApi.uploadFiles(formData)
                .then(() => {
                    this.setState({uploadPending: false}, () => {
                        this.fireUploadComplete();
                    });
                });
        });
    }

    public handleEditTags(): void {
        this.setState({
            tagEditMode: true
        });
    }

    public renderSearchSection(): ReactNode {
        return (
            <Panel className='search-section'>
                <HotKeys handlers={{enter: this.search.bind(this)}}>
                    <PanelHeader>
                        <h2>Search</h2>
                    </PanelHeader>

                    <PanelBody>
                        <div className='search-form'>
                            <AutocompleteInput ref={input => this.searchInput = input} tokenize
                                               items={this.state.tags.map(tag => tag.id)}
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

    public renderUploadSection(): ReactNode {
        if (!this.getProps().uploadDisabled) {
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
                        <div className={`upload-form ${this.state.uploadPending ? 'upload-pending' : ''}`}>
                            <div className='input-container'>
                                <input id={`${this.id}-upload-input`}
                                       ref={input => this.fileInput = input}
                                       className='upload-input'
                                       type='file'
                                       multiple
                                       accept={this.state.mimeTypes.join(', ')}
                                       onChange={() => this.forceUpdate()}/>
                                <label htmlFor={`${this.id}-upload-input`} className='button upload-input-label'>
                                    <i className='material-icons'>file_upload</i>
                                    {uploadText}
                                </label>
                            </div>
                            <button className='upload-button accent'
                                    onClick={this.uploadImages.bind(this)}
                                    disabled={this.canUpload()}>
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
    }

    public renderTagsSection(): ReactNode {
        const tagList = this.getTagList();
        if ((!tagList || !tagList.length) && !this.getProps().tagsEditable) {
            return;
        }

        let editIcon = null;
        if (this.getProps().tagsEditable && !this.state.tagEditMode) {
            editIcon = <i className='material-icons' onClick={this.handleEditTags.bind(this)}>edit</i>;
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
            <Panel className='tags-section'>
                <PanelHeader>
                    <h2>Tags</h2>
                    {editIcon}
                </PanelHeader>
                {body}
            </Panel>
        );
    }

    public getTagList(): string[] {
        const images = this.getProps().images;

        if (!images) {
            return null;
        }

        const tagCounts = images.reduce((previous, current) => {
            current.tags.forEach(tag => {
                if (previous[tag]) {
                    previous[tag] = previous[tag] + 1;
                } else {
                    previous[tag] = 1;
                }
            });
            return previous;
        }, {} as {[tag: string]: number});

        const tagLimit = this.getProps().tagLimit;

        return Object.keys(tagCounts)
            .sort((t1, t2) => {
                const c1 = tagCounts[t1],
                      c2 = tagCounts[t2];
                return c1 > c2 ? -1 : c1 < c2 ? 1 : t1 < t2 ? -1 : t1 > t2 ? 1 : 0;
            })
            .filter((tag, index) => {
                return index < tagLimit;
            });
    }

    public renderTagsList(tagList: string[]): ReactNode {
        const tagListItems = tagList.map(tag => {
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

    public render(): ReactElement<ImageSidebarProps> {
        return (
            <div className='ImageSidebar'>
                {this.renderSearchSection()}
                {this.renderUploadSection()}
                {this.renderTagsSection()}
            </div>
        );
    }

    protected defaultProps(): ImageSidebarProps {
        return {
            onUploadComplete: _.noop,
            onTagsChange    : _.noop,
            uploadDisabled  : false,
            tagsEditable    : false,
            images          : [],
            tagLimit        : Infinity,
            match           : undefined,
            location        : undefined,
            history         : undefined
        };
    }
}

const ImageSidebarComponent = withRouter(ImageSidebar);

// Workaround to prevent having to pass in RouteComponentProps when using the ImageSidebar externally
export default class extends React.Component<ImageSidebarBaseProps, {}> {
    public render(): ReactElement<ImageSidebarBaseProps> {
        return (
            <ImageSidebarComponent {...this.props as any}/>
        );
    }
}
