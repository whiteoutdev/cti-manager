import * as _ from 'lodash';
import * as React from 'react';
import {HotKeys} from 'react-hotkeys';

import {FormEvent, HTMLProps, KeyboardEvent, ReactElement, ReactNode} from 'react';
import {AbstractComponent} from '../AbstractComponent/AbstractComponent';
import './AutocompleteInput.scss';

const props        = ['limit', 'items', 'onEnter', 'onAutocomplete', 'tokenize'],
      defaultLimit = 10;

interface AutocompleteInputProps extends HTMLProps<AutocompleteInput> {
    tokenize?: boolean;
    onAutocomplete?: (item: string) => void;
    onEnter?: (item: string) => void;
    limit?: number;
    items?: string[];
}

interface AutocompleteInputState {
    suggestions: string[];
    suggestionIndex?: number;
}

class AutocompleteInput extends AbstractComponent<AutocompleteInputProps, AutocompleteInputState> {
    private input: HTMLInputElement;
    private keyHandlers = {
        enter : this.completeSuggestion.bind(this),
        escape: this.closeSuggestions.bind(this),
        up    : this.previousSuggestion.bind(this),
        down  : this.nextSuggestion.bind(this)
    };

    constructor() {
        super();
        this.state = {
            suggestions: []
        };
    }

    public get value(): string {
        return this.input.value;
    }

    public set value(value: string) {
        this.input.value = value;
    }

    public focus(): void {
        this.input.focus();
    }

    public blur(): void {
        this.input.blur();
    }

    public componentDidUpdate(): void {
        this.input.focus();
    }

    public completeSuggestion(index: number): void {
        if (typeof index !== 'number') {
            index = this.state.suggestionIndex;
        }

        if (!this.state.suggestions.length) {
            this.fireEnter();
            return;
        }

        const suggestion = this.state.suggestions[index % this.state.suggestions.length];

        if (this.getProps().tokenize) {

            const cursorPosition      = this.input.selectionStart,
                  beforeCursor        = this.input.value.substring(0, cursorPosition),
                  afterCursor         = this.input.value.substr(cursorPosition),
                  queriesBeforeCursor = beforeCursor.split(' ');

            queriesBeforeCursor[queriesBeforeCursor.length - 1] = suggestion;

            this.input.value = `${queriesBeforeCursor.join(' ')}${afterCursor || ' '}`;
        } else {
            this.input.value = suggestion;
        }

        this.closeSuggestions().then(() => {
            this.fireAutocomplete(suggestion);
        });
    }

    public closeSuggestions(): Promise<void> {
        return new Promise(resolve => {
            this.setState({
                suggestions    : [],
                suggestionIndex: 0
            }, () => {
                resolve();
            });
        });
    }

    public nextSuggestion(e: KeyboardEvent<any>): void {
        e.preventDefault();
        this.setSuggestionIndex(this.state.suggestionIndex + 1);
    }

    public previousSuggestion(e: KeyboardEvent<any>): void {
        e.preventDefault();
        this.setSuggestionIndex(this.state.suggestionIndex - 1);
    }

    public setSuggestionIndex(index: number): void {
        this.setState({
            suggestionIndex: index
        });
    }

    public fireAutocomplete(item: string): void {
        this.getProps().onAutocomplete(item);
    }

    public fireEnter(): void {
        this.getProps().onEnter(this.input.value);
    }

    public updateSuggestions(): void {
        if (this.getProps().tokenize) {
            const cursorPosition = this.input.selectionStart,
                  beforeCursor   = this.input.value.substring(0, cursorPosition),
                  afterCursor    = this.input.value.substr(cursorPosition);
            if (/(^\s)|^$/.test(afterCursor)) {
                const queriesBeforeCursor = beforeCursor.split(' '),
                      currentQuery        = queriesBeforeCursor[queriesBeforeCursor.length - 1];
                this.filterSuggestions(currentQuery);
            } else {
                this.closeSuggestions();
            }
        } else {
            this.filterSuggestions(this.input.value);
        }
    }

    public filterSuggestions(query: string): void {
        if (!query) {
            this.closeSuggestions();
            return;
        }

        query = query.toLowerCase();
        const suggestions = [],
              limit       = Number(this.getProps().limit) || defaultLimit;

        for (let i = 0; i < this.getProps().items.length && suggestions.length < limit; i++) {
            const item = this.getProps().items[i];
            if (item.toLowerCase().indexOf(query) > -1) {
                suggestions.push(item);
            }
        }

        this.setState({
            suggestions,
            suggestionIndex: 0
        });
    }

    public onChange(e: FormEvent<AutocompleteInput>): void {
        this.getProps().onChange(e);
        if (!e.defaultPrevented) {
            this.updateSuggestions();
        }
    }

    public trimProps(): {[key: string]: any} {
        const trimmed: {[key: string]: any} = {};
        _.each(this.getProps(), (value, key) => {
            if (!~props.indexOf(key)) {
                trimmed[key] = value;
            }
        });
        return trimmed;
    }

    public renderSuggestionList(): ReactNode {
        if (this.state.suggestions.length) {
            const listItems = this.state.suggestions.map((suggestion, index) => {
                let className = 'suggestion';
                if (index === this.state.suggestionIndex % this.state.suggestions.length) {
                    className += ' selected';
                }
                return (
                    <li key={suggestion}
                        className={className}
                        onMouseOver={() => this.setSuggestionIndex(index)}
                        onClick={() => this.completeSuggestion(index)}>
                        {suggestion}
                    </li>
                );
            });
            return (
                <ul className='suggestion-list'>
                    {listItems}
                </ul>
            );
        } else {
            return null;
        }
    }

    public render(): ReactElement<AutocompleteInputProps> {
        return (
            <div className='AutocompleteInput'>
                <HotKeys handlers={this.keyHandlers}>
                    <input type='text'
                           ref={input => this.input = input} {...this.trimProps()}
                           onChange={this.onChange.bind(this)}/>
                    <div className='dropdown-box'>
                        {this.renderSuggestionList()}
                    </div>
                </HotKeys>
            </div>
        );
    }

    protected defaultProps(): AutocompleteInputProps {
        return {
            tokenize      : false,
            onAutocomplete: _.noop,
            onEnter       : _.noop,
            limit         : defaultLimit,
            items         : [],
            onChange      : _.noop
        };
    }
}

export default AutocompleteInput;
