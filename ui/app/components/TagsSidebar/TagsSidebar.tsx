import * as React from 'react';
import * as _ from 'lodash';
import escapeRegex = require('escape-string-regexp');
import Panel from '../Panel/Panel';
import PanelHeader from '../Panel/PanelHeader';
import PanelBody from '../Panel/PanelBody';
import PanelButtons from '../Panel/PanelButtons';
import PanelButton from '../Panel/PanelButton';
import PanelList from '../Panel/PanelList';
import PanelListItem from '../Panel/PanelListItem';
import TagService from '../../services/TagService';
import TagsApi from '../../api/TagsApi';
import TagStore, {TagStoreState} from '../../stores/TagStore';
import './TagsSidebar.scss';
import {AbstractRefluxComponent} from '../AbstractComponent/AbstractComponent';
import Tag from '../../model/tag/Tag';
import Hotkeys from '../Hotkeys/Hotkeys';

interface TagsSidebarProps {
    onTagSelect: Function;
}

interface TagsSidebarState extends TagStoreState {
    searchResults: Tag[];
    regexMode: boolean;
    selectedTag: Tag
    queryError: string;
}

class TagsSidebar extends AbstractRefluxComponent<TagsSidebarProps, TagsSidebarState> {
    private searchInput: HTMLInputElement;

    constructor() {
        super();
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

    setRegexMode(regexMode: boolean) {
        this.setState({regexMode});
    }

    createRegexString(query: string) {
        return query.split('*')
            .map(part => escapeRegex(part))
            .join('.*');
    }

    search() {
        const query = this.searchInput.value;
        if (!query) {
            return;
        }

        const regexQuery = this.state.regexMode ? query : this.createRegexString(query);
        try {
            new RegExp(regexQuery);
            this.setState({queryError: null});
        } catch (e) {
            this.setState({queryError: e.message});
            return;
        }

        TagsApi.getTags(regexQuery).then((tags) => {
            this.setState({searchResults: tags});
        });
    }

    fireTagSelect() {
        this.getProps().onTagSelect(this.state.selectedTag);
    }

    selectTag(tag: Tag) {
        this.setState({selectedTag: tag}, this.fireTagSelect);
    }

    renderSearchPanel() {
        return (
            <Panel>
                <PanelHeader>
                    <h2>Tag Search</h2>
                </PanelHeader>
                <PanelBody className="search-panel-body">
                    <Hotkeys className="search-container" handlers={{enter: this.search.bind(this)}}>
                        <input ref={input => this.searchInput = input} type="text"/>
                        <button className="search-button accent" onClick={this.search.bind(this)}>
                            <i className="material-icons">search</i>
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

    renderTagList(results: Tag[]) {
        return results.map((result) => {
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

    renderSearchResultsPanel() {
        const results = this.state.searchResults;
        if (!results || !results.length) {
            return null;
        }

        return (
            <Panel>
                <PanelHeader>
                    <h2>Search Results</h2>
                </PanelHeader>
                <PanelList className="search-results-list">
                    {this.renderTagList(results)}
                </PanelList>
            </Panel>
        );
    }

    render() {
        return (
            <div className="TagsSidebar">
                {this.renderSearchPanel()}
                {this.renderSearchResultsPanel()}
            </div>
        );
    }

    protected defaultProps(): TagsSidebarProps {
        return {
            onTagSelect: _.noop
        };
    }
}

export default TagsSidebar;
