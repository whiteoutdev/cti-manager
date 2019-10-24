import escapeRegex = require('escape-string-regexp');
import * as _ from 'lodash';
import * as React from 'react';
import {ReactElement, ReactNode} from 'react';
import TagsApi from '../../api/TagsApi';
import Tag from '../../model/tag/Tag';
import TagService from '../../services/TagService';
import {TagStore, TagStoreState} from '../../stores/TagStore';
import {AbstractRefluxComponent} from '../AbstractComponent/AbstractComponent';
import Hotkeys from '../Hotkeys/Hotkeys';
import Panel from '../Panel/Panel';
import PanelBody from '../Panel/PanelBody';
import PanelButton from '../Panel/PanelButton';
import PanelButtons from '../Panel/PanelButtons';
import PanelHeader from '../Panel/PanelHeader';
import PanelList from '../Panel/PanelList';
import PanelListItem from '../Panel/PanelListItem';
import './TagsSidebar.scss';

interface TagsSidebarProps {
    onTagSelect: (tag: Tag) => void;
}

interface TagsSidebarState extends TagStoreState {
    searchResults: Tag[];
    regexMode: boolean;
    selectedTag: Tag;
    queryError: string;
}

class TagsSidebar extends AbstractRefluxComponent<TagsSidebarProps, TagsSidebarState> {
    public static defaultProps: TagsSidebarProps = {
        onTagSelect: _.noop
    };

    private searchInput: HTMLInputElement;

    constructor(props: TagsSidebarProps) {
        super(props);
        this.state = {
            searchResults: [],
            regexMode    : false,
            selectedTag  : null,
            tags         : [],
            tagIndex     : {},
            queryError   : null
        };
        this.store = TagStore;
    }

    public setRegexMode(regexMode: boolean): void {
        this.setState({regexMode});
    }

    public createRegexString(query: string): string {
        return query.split('*')
            .map(part => escapeRegex(part))
            .join('.*');
    }

    public search(): Promise<void> {
        const query = this.searchInput.value;
        if (!query) {
            return Promise.resolve();
        }

        const regexQuery = this.state.regexMode ? query : this.createRegexString(query);
        try {
            // tslint:disable-next-line:no-unused-expression
            new RegExp(regexQuery);
            this.setState({queryError: null});
        } catch (e) {
            this.setState({queryError: e.message});
            return Promise.resolve();
        }

        return TagsApi.getTags(regexQuery)
            .then(tags => {
                this.setState({searchResults: tags});
            });
    }

    public fireTagSelect(): void {
        this.getProps().onTagSelect(this.state.selectedTag);
    }

    public selectTag(tag: Tag): void {
        this.setState({selectedTag: tag}, this.fireTagSelect);
    }

    public renderSearchPanel(): ReactNode {
        return (
            <Panel>
                <PanelHeader>
                    <h2>Tag Search</h2>
                </PanelHeader>
                <PanelBody className='search-panel-body'>
                    <Hotkeys className='search-container' handlers={{enter: this.search.bind(this)}}>
                        <input ref={input => this.searchInput = input} type='text'/>
                        <button className='search-button accent' onClick={this.search.bind(this)}>
                            <i className='material-icons'>search</i>
                        </button>
                    </Hotkeys>
                </PanelBody>
                <PanelButtons>
                    <PanelButton className={this.state.regexMode ? '' : 'accent'}
                                 onClick={() => this.setRegexMode(false)}>
                        Simple
                    </PanelButton>
                    <PanelButton className={this.state.regexMode ? 'accent' : ''}
                                 onClick={() => this.setRegexMode(true)}>
                        Regex
                    </PanelButton>
                </PanelButtons>
            </Panel>
        );
    }

    public renderTagList(results: Tag[]): ReactNode {
        return results.map(result => {
            const tag      = this.state.tagIndex[result.id] || result,
                  selected = this.state.selectedTag ? tag.id === this.state.selectedTag.id : false;
            return (
                <PanelListItem key={tag.id} onClick={() => this.selectTag(tag)}
                               className={`search-result-item ${tag.type} ${selected ? 'selected' : ''}`}>
                    {TagService.toDisplayName(tag.id)}
                </PanelListItem>
            );
        });
    }

    public renderSearchResultsPanel(): ReactNode {
        const results = this.state.searchResults;
        if (!results || !results.length) {
            return null;
        }

        return (
            <Panel>
                <PanelHeader>
                    <h2>Search Results</h2>
                </PanelHeader>
                <PanelList className='search-results-list'>
                    {this.renderTagList(results)}
                </PanelList>
            </Panel>
        );
    }

    public render(): ReactElement<TagsSidebarProps> {
        return (
            <div className='TagsSidebar'>
                {this.renderSearchPanel()}
                {this.renderSearchResultsPanel()}
            </div>
        );
    }

    protected getBaseProps(): TagsSidebarProps {
        return TagsSidebar.defaultProps;
    }
}

export default TagsSidebar;
