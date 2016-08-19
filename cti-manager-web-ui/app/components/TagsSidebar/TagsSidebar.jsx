import React from 'react';
import {HotKeys} from 'react-hotkeys';
import escapeRegex from 'escape-string-regexp';

import Panel from '../Panel/Panel.jsx';
import PanelHeader from '../Panel/PanelHeader.jsx';
import PanelBody from '../Panel/PanelBody.jsx';
import PanelButtons from '../Panel/PanelButtons.jsx';
import PanelButton from '../Panel/PanelButton.jsx';
import PanelList from '../Panel/PanelList.jsx';
import PanelListItem from '../Panel/PanelListItem.jsx';

import TagsApi from '../../api/TagsApi';

import './TagsSidebar.scss';

export default class TagsSidebar extends React.Component {
    constructor() {
        super();
        this.state = {
            searchResults: [],
            regexMode    : false,
            selectedTag  : null
        };
    }

    setRegexMode(regexMode) {
        this.setState({regexMode});
    }

    createRegexString(query) {
        const parts = query.split('*').map(part => escapeRegex(part));
        return parts.join('.*');
    }

    search() {
        const query = this.refs.searchInput.value;
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

    renderSearchPanel() {
        return (
            <Panel>
                <PanelHeader>
                    <h2>Tag Search</h2>
                </PanelHeader>
                <PanelBody className="search-panel-body">
                    <HotKeys className="search-container" handlers={{enter: this.search.bind(this)}}>
                        <input ref="searchInput" type="text"/>
                        <button className="search-button accent" onClick={this.search.bind(this)}>
                            <i className="material-icons">search</i>
                        </button>
                    </HotKeys>
                </PanelBody>
                <PanelButtons>
                    <PanelButton className={this.state.regexMode ? '' : 'accent'}
                                 onClick={() => {this.setRegexMode(false)}}>
                        Simple
                    </PanelButton>
                    <PanelButton className={this.state.regexMode ? 'accent' : ''}
                                 onClick={() => {this.setRegexMode(true)}}>
                        Regex
                    </PanelButton>
                </PanelButtons>
            </Panel>
        );
    }

    renderTagList(results) {
        return results.map((result) => {
            const selected = result.id === this.state.selectedTag;
            console.log(result);
            return (
                <PanelListItem key={result.id} onClick={() => {this.setState({selectedTag: result.id})}}
                               className={`search-result-item ${result.type} ${selected ? 'selected' : ''}`}>
                    {result.id.replace('_', ' ')}
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
};
