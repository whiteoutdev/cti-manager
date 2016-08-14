import React from 'react';
import {HotKeys} from 'react-hotkeys';
import _ from 'lodash';

import './AutocompleteInput.scss';

const props = ['limit', 'items', 'onEnter', 'onAutocomplete', 'tokenize'];

export default class AutocompleteInput extends React.Component {
    constructor() {
        super();
        this.state = {
            suggestions: []
        };
        this.keyHandlers = {
            enter : this.completeSuggestion.bind(this),
            escape: this.closeSuggestions.bind(this),
            up    : this.previousSuggestion.bind(this),
            down  : this.nextSuggestion.bind(this)
        };
    }

    get value() {
        return this.refs.input.value;
    }

    set value(value) {
        this.refs.input.value = value;
    }

    focus() {
        this.refs.input.focus();
    }

    blur() {
        this.refs.input.blur();
    }

    componentDidUpdate() {
        this.refs.input.focus();
    }

    completeSuggestion(index) {
        if (typeof index !== 'number') {
            index = this.state.suggestionIndex;
        }

        if (!this.state.suggestions.length) {
            this.fireEnter();
            return;
        }

        const suggestion = this.state.suggestions[index % this.state.suggestions.length];

        if (this.props.tokenize) {

            const cursorPosition      = this.refs.input.selectionStart,
                  beforeCursor        = this.refs.input.value.substring(0, cursorPosition),
                  afterCursor         = this.refs.input.value.substr(cursorPosition),
                  queriesBeforeCursor = beforeCursor.split(' ');

            queriesBeforeCursor[queriesBeforeCursor.length - 1] = suggestion;

            this.refs.input.value = `${queriesBeforeCursor.join(' ')}${afterCursor || ' '}`;
        } else {
            this.refs.input.value = suggestion;
        }

        this.closeSuggestions().then(() => {
            this.fireAutocomplete(suggestion);
        });
    }

    closeSuggestions() {
        return new Promise((resolve) => {
            this.setState({
                suggestions    : [],
                suggestionIndex: 0
            }, () => {
                resolve();
            });
        });
    }

    nextSuggestion(e) {
        e.preventDefault();
        this.setSuggestionIndex(this.state.suggestionIndex + 1);
    }

    previousSuggestion(e) {
        e.preventDefault();
        this.setSuggestionIndex(this.state.suggestionIndex - 1);
    }

    setSuggestionIndex(index) {
        this.setState({
            suggestionIndex: index
        });
    }

    fireAutocomplete(item) {
        if (typeof this.props.onAutocomplete === 'function') {
            this.props.onAutocomplete(item);
        }
    }

    fireEnter() {
        if (typeof this.props.onEnter === 'function') {
            this.props.onEnter(this.refs.input.value);
        }
    }

    updateSuggestions() {
        if (this.props.tokenize) {
            const cursorPosition = this.refs.input.selectionStart,
                  beforeCursor   = this.refs.input.value.substring(0, cursorPosition),
                  afterCursor    = this.refs.input.value.substr(cursorPosition);
            if (/(^\s)|^$/.test(afterCursor)) {
                const queriesBeforeCursor = beforeCursor.split(' '),
                      currentQuery        = queriesBeforeCursor[queriesBeforeCursor.length - 1];
                this.filterSuggestions(currentQuery);
            } else {
                this.closeSuggestions();
            }
        } else {
            this.filterSuggestions(this.refs.input.value);
        }
    }

    filterSuggestions(query) {
        if (!query) {
            this.closeSuggestions();
            return;
        }

        query = query.toLowerCase();
        const suggestions = [],
              limit       = Number(this.props.limit) || 10;

        for (let i = 0; i < this.props.items.length && suggestions.length < limit; i++) {
            const item = this.props.items[i];
            if (item.toLowerCase().indexOf(query) > -1) {
                suggestions.push(item);
            }
        }

        this.setState({
            suggestions,
            suggestionIndex: 0
        });
    }

    onChange(e) {
        if (typeof this.props.onChange === 'function') {
            this.props.onChange(e);
        }
        if (!e.defaultPrevented) {
            this.updateSuggestions();
        }
    }

    trimProps() {
        const trimmed = {};
        _.each(this.props, (value, key) => {
            if (!~props.indexOf(key)) {
                trimmed[key] = value;
            }
        });
        return trimmed;
    }

    renderSuggestionList() {
        if (this.state.suggestions.length) {
            const listItems = this.state.suggestions.map((suggestion, index) => {
                let className = 'suggestion';
                if (index === this.state.suggestionIndex % this.state.suggestions.length) {
                    className += ' selected';
                }
                return (
                    <li key={suggestion}
                        className={className}
                        onMouseOver={() => {this.setSuggestionIndex(index)}}
                        onClick={() => {this.completeSuggestion(index)}}>
                        {suggestion}
                    </li>
                );
            });
            return <ul className="suggestion-list">
                {listItems}
            </ul>
        } else {
            return null;
        }
    }

    render() {
        return (
            <div className="AutocompleteInput">
                <HotKeys handlers={this.keyHandlers}>
                    <input type="text" ref="input" {...this.trimProps()} onChange={this.onChange.bind(this)}/>
                    <div className="dropdown-box">
                        {this.renderSuggestionList()}
                    </div>
                </HotKeys>
            </div>
        );
    }
};
