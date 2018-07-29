import * as React from 'react';
import {Component, Store} from 'reflux';
import * as uuid from 'uuid';

import AutocompleteInput from '../AutocompleteInput/AutocompleteInput';
import EditableLink from '../EditableLink/EditableLink';
import NavbarredPage from '../NavbarredPage/NavbarredPage';
import TagsSidebar from '../TagsSidebar/TagsSidebar';

import TagActions from '../../actions/TagActions';
import TagsApi from '../../api/TagsApi';
import TagService from '../../services/TagService';
import UrlService from '../../services/UrlService';
import {TagStore, TagStoreState} from '../../stores/TagStore';
import {TagTypeStore, TagTypeStoreState} from '../../stores/TagTypeStore';

import {ReactElement, ReactNode} from 'react';
import {RouteComponentProps} from 'react-router';
import Tag from '../../model/tag/Tag';
import Hotkeys from '../Hotkeys/Hotkeys';
import './TagsPage.scss';

interface TagsPageRouteParams {
    tagID: string;
}

// tslint:disable-next-line:no-empty-interface
interface TagsPageProps extends RouteComponentProps<TagsPageRouteParams> {
}

interface TagsPageState extends TagStoreState, TagTypeStoreState {
    originalTag: Tag;
    tag: Tag;
}

class TagsPage extends Component<typeof Store, TagsPageProps, TagsPageState> {
    private tagInput: AutocompleteInput;
    private pixivIdInput: HTMLInputElement;
    private tagUrlInput: HTMLInputElement;

    constructor(props: TagsPageProps) {
        super(props);
        this.state = {
            originalTag: null,
            tag        : null,
            tags       : [],
            tagIndex   : {},
            tagTypes   : []
        };
        this.stores = [TagTypeStore, TagStore];
    }

    public onTagSelect(tag: Tag): void {
        this.setState({
            originalTag: tag,
            tag        : JSON.parse(JSON.stringify(tag))
        });
    }

    public componentDidMount(): Promise<void> {
        TagActions.updateTagTypes();
        if (this.getTagID()) {
            return this.loadTag(this.getTagID());
        }
        return Promise.resolve();
    }

    public componentDidUpdate(): void {
        // TODO: Look into this
        // tslint:disable-next-line:no-console
        console.log(this.pixivIdInput);
        if (this.pixivIdInput) {
            this.pixivIdInput.select();
        }
    }

    public componentWillReceiveProps(nextProps: TagsPageProps): Promise<void> {
        const newTagID = this.getTagID(nextProps);
        if (!newTagID) {
            return new Promise(resolve => {
                this.setState({
                    tag: null
                }, () => resolve());
            });
        } else if (newTagID !== this.getTagID()) {
            return this.loadTag(newTagID);
        }
    }

    public getTagID(props?: TagsPageProps): string {
        props = props || this.props;
        return props.match.params.tagID;
    }

    public loadTag(tagId: string): Promise<void> {
        return TagsApi.getTag(tagId)
            .then(tag => this.setState({tag}));
    }

    public setTagType(tagType: string): Promise<void> {
        const tag = this.state.tag;
        tag.type = tagType;
        return TagsApi.updateTag(tag.id, tag);
    }

    public addDerivedTagAndClear(derivedTag: string): Promise<void> {
        if (!derivedTag) {
            return Promise.resolve();
        }

        const tag = this.state.tag;
        if (!~tag.derivedTags.indexOf(derivedTag)) {
            tag.derivedTags.push(derivedTag);
        }

        this.tagInput.value = '';
        return TagsApi.updateTag(tag.id, tag);
    }

    public addDerivedTagFromInput(): Promise<void> {
        const derivedTag = this.tagInput.value;
        return this.addDerivedTagAndClear(derivedTag);
    }

    public removeDerivedTag(derivedTagId: string): Promise<void> {
        const tag   = this.state.tag,
              index = this.state.tag.derivedTags.indexOf(derivedTagId);
        if (~index) {
            tag.derivedTags.splice(index, 1);
            return TagsApi.updateTag(tag.id, tag);
        }
        return Promise.resolve();
    }

    public setMetadata(key: string, value: any): Promise<void> {
        const tag = this.state.tag;
        (tag.metadata as any)[key] = value;
        return TagsApi.updateTag(tag.id, tag);
    }

    public addTagUrl(): Promise<void> {
        const tag = this.state.tag;
        tag.metadata.urls.push(this.tagUrlInput.value);
        return TagsApi.updateTag(tag.id, tag);
    }

    public removeUrl(index: number): Promise<void> {
        const tag = this.state.tag;
        tag.metadata.urls.splice(index, 1);
        return TagsApi.updateTag(tag.id, tag);
    }

    public renderTagNameSection(tag: Tag): ReactNode {
        return (
            <div className='tag-fact'>
                <div className='left-col'>
                    <h2>Tag Name:</h2>
                </div>
                <div className='right-col'>
                    <h2>{TagService.toDisplayName(tag.id)}</h2>
                </div>
            </div>
        );
    }

    public renderTagTypeSection(tag: Tag): ReactNode {
        const tagTypeList = this.state.tagTypes.map(tagType => {
            const className = `tag-type-button ${tagType.toLowerCase()} ${tagType === tag.type ? 'selected' : ''}`;
            return (
                <li key={tagType} className='tag-type'>
                    <button className={className} onClick={() => this.setTagType(tagType)}>
                        {capitalise(tagType)}
                    </button>
                </li>
            );
        });

        return (
            <div className='tag-fact'>
                <div className='left-col'>
                    Tag Type:
                </div>
                <div className='right-col'>
                    <ul className='tag-type-list'>
                        {tagTypeList}
                    </ul>
                </div>
            </div>
        );
    }

    public renderDerivedTagsSection(tag: Tag): ReactNode {
        const derivedTagList = tag.derivedTags.map(derivedTagId => {
            const derivedTag     = this.state.tagIndex[derivedTagId],
                  derivedTagType = derivedTag ? derivedTag.type.toLowerCase() : '';

            return (
                <li key={derivedTagId} className={`derived-tag ${derivedTagType}`}>
                    <span>{TagService.toDisplayName(derivedTagId)}</span>
                    <i className='delete-icon material-icons' onClick={() => this.removeDerivedTag(derivedTagId)}>
                        delete
                    </i>
                </li>
            );
        });

        return (
            <div className='tag-fact derived-tags-section'>
                <div className='left-col'>
                    Derived tags:
                </div>
                <div className='right-col'>
                    <div className='tag-search-section'>
                        <AutocompleteInput ref={input => this.tagInput = input}
                                           className='with-addon'
                                           items={this.state.tags.map(t => t.id)}
                                           onAutocomplete={this.addDerivedTagAndClear.bind(this)}
                                           onEnter={this.addDerivedTagFromInput.bind(this)}/>
                        <button className='accent'>
                            <i className='material-icons'>add</i>
                        </button>
                    </div>
                    <ul className='derived-tag-list'>
                        {derivedTagList}
                    </ul>
                </div>
            </div>
        );
    }

    public renderPixivIdSection(tag: Tag): ReactNode {
        if (tag.type !== 'artist') {
            return null;
        }
        const pixivId = tag.metadata.pixivId;

        return (
            <div className='tag-fact pixiv-id-section'>
                <div className='left-col'>
                    Pixiv ID:
                </div>
                <div className='right-col'>
                    <EditableLink display={pixivId}
                                  link={`http://www.pixiv.net/member.php?id=${pixivId}`}
                                  onSave={newPixivId => this.setMetadata('pixivId', newPixivId)}/>
                </div>
            </div>
        );
    }

    public renderBooruLinksSection(tag: Tag): ReactNode {
        const gelbooruLink = `http://www.gelbooru.com/index.php?page=post&s=list&tags=${tag.metadata.gelbooruTag}`,
              danbooruLink = `http://danbooru.donmai.us/posts?tags=${tag.metadata.danbooruTag}`;

        return [
            <div key='gelbooru' className='tag-fact gelbooru-link-section'>
                <div className='left-col'>Gelbooru Tag:</div>
                <div className='right-col'>
                    <EditableLink display={tag.metadata.gelbooruTag}
                                  link={gelbooruLink}
                                  onSave={newTag => this.setMetadata('gelbooruTag', newTag)}/>
                </div>
            </div>,
            <div key='danbooru' className='tag-fact danbooru-link-section'>
                <div className='left-col'>Danbooru Tag:</div>
                <div className='right-col'>
                    <EditableLink display={tag.metadata.danbooruTag}
                                  link={danbooruLink}
                                  onSave={newTag => this.setMetadata('danbooruTag', newTag)}/>
                </div>
            </div>
        ];
    }

    public renderTagUrlsSection(tag: Tag): ReactNode {
        const urlItems = tag.metadata.urls.map((url, index) => {
            return (
                <li key={uuid.v4()} className='url-list-item'>
                    <a href={UrlService.createAbsoluteUrl(url)}>{url}</a>
                    <i className='material-icons delete-icon' onClick={() => this.removeUrl(index)}>delete</i>
                </li>
            );
        });

        return (
            <div className='tag-fact tag-urls-section'>
                <div className='left-col'>Links:</div>
                <div className='right-col'>
                    <Hotkeys className='tag-url-input-form' handlers={{enter: this.addTagUrl.bind(this)}}>
                        <input ref={input => this.tagUrlInput = input} type='text' className='with-addon'/>
                        <button className='accent' onClick={this.addTagUrl.bind(this)}>
                            <i className='material-icons'>add</i>
                        </button>
                    </Hotkeys>
                    <ul className='url-list'>
                        {urlItems}
                    </ul>
                </div>
            </div>
        );
    }

    public renderTagDetails(): ReactNode {
        const tag = this.state.tag;
        if (!tag) {
            return null;
        }

        return (
            <div className='tag-details-section'>
                <div className='tag-details-card'>
                    {this.renderTagNameSection(tag)}
                    {this.renderTagTypeSection(tag)}
                    {this.renderDerivedTagsSection(tag)}
                    {this.renderPixivIdSection(tag)}
                    {this.renderBooruLinksSection(tag)}
                    {this.renderTagUrlsSection(tag)}
                </div>
            </div>
        );
    }

    public render(): ReactElement<TagsPageProps> {
        return (
            <div className='TagsPage'>
                <NavbarredPage>
                    <TagsSidebar onTagSelect={this.onTagSelect.bind(this)}/>
                    {this.renderTagDetails()}
                </NavbarredPage>
            </div>
        );
    }
}

export default TagsPage;

function capitalise(str: string): string {
    return str.toLowerCase()
        .replace(/(^|\s)(\w)/g, (match, g1, g2) => `${g1}${g2.toUpperCase()}`);
}
