import React from 'react';
import {HotKeys} from 'react-hotkeys';
import _ from 'lodash';

import './AutocompleteInput.scss';

const props = ['limit', 'items', 'onEnter'];

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

    componentDidUpdate() {
        this.refs.input.focus();
    }

    completeSuggestion(index) {
        if (typeof index !== 'number') {
            index = this.state.suggestionIndex;
        }
        const suggestion = this.state.suggestions[index % this.state.suggestions.length],
              queries    = this.refs.input.value.split(' '),
              lastQuery  = queries[queries.length - 1];

        if (!lastQuery || !this.state.suggestions.length) {
            this.fireEnter();
            return;
        }

        queries[queries.length - 1] = `${suggestion} `;
        this.refs.input.value = queries.join(' ');
        this.closeSuggestions();
    }

    closeSuggestions() {
        this.setState({
            suggestions    : [],
            suggestionIndex: 0
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

    fireEnter() {
        if (typeof this.props.onEnter === 'function') {
            this.props.onEnter(this.refs.input.value);
        }
    }

    updateSuggestions() {
        const queries = this.refs.input.value.split(' '),
              query   = queries[queries.length - 1];
        this.filterSuggestions(query);
    }

    filterSuggestions(query) {
        if (!query) {
            this.closeSuggestions();
            return;
        }

        const limit       = Number(this.props.limit) || 10,
              suggestions = this.props.items.filter((item, index) => {
                  return ~item.toLowerCase().indexOf(query.toLowerCase()) && index < limit;
              });
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
