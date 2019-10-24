import {noop} from 'lodash';
import * as React from 'react';
import {Component, FormEvent, HTMLProps, KeyboardEvent, ReactElement, ReactNode} from 'react';
import {filterPropsFor} from 'react-attrs-filter';
import {HotKeys} from 'react-hotkeys';
import appConfig from '../../config/app.config';
import './AutocompleteInput.scss';

export interface AutocompleteInputProps extends HTMLProps<AutocompleteInput> {
    tokenize?: boolean;
    onAutocomplete?: (item: string) => void;
    onEnter?: (item: string) => void;
    limit?: number;
    items?: string[];
}

export interface AutocompleteInputState {
    suggestions: string[];
    suggestionIndex?: number;
}

export class AutocompleteInput extends Component<AutocompleteInputProps, AutocompleteInputState> {
    public static defaultProps: AutocompleteInputProps = {
        tokenize      : false,
        onAutocomplete: noop,
        onEnter       : noop,
        limit         : appConfig.autocomplete.defaultSuggestionLimit,
        items         : []
    };

    private input: HTMLInputElement;
    private keyHandlers = {
        enter : this.completeSuggestion.bind(this),
        escape: this.closeSuggestions.bind(this),
        up    : this.previousSuggestion.bind(this),
        down  : this.nextSuggestion.bind(this)
    };

    constructor(props: AutocompleteInputProps) {
        super(props);
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

    public render(): ReactElement<AutocompleteInputProps> {
        return (
            <div className='AutocompleteInput'>
                <HotKeys handlers={this.keyHandlers}>
                    <input {...filterPropsFor(this.props, 'input')}
                           type='text'
                           ref={input => this.input = input}
                           onChange={this.onChange.bind(this)}/>
                    <div className='dropdown-box'>
                        {this.renderSuggestionList()}
                    </div>
                </HotKeys>
            </div>
        );
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

        if (this.props.tokenize) {

            const cursorPosition      = this.input.selectionStart,
                  beforeCursor        = this.input.value.substring(0, cursorPosition),
                  afterCursor         = this.input.value.substr(cursorPosition),
                  queriesBeforeCursor = beforeCursor.split(' ');

            queriesBeforeCursor[queriesBeforeCursor.length - 1] = suggestion;

            this.input.value = `${queriesBeforeCursor.join(' ')}${afterCursor || ' '}`;
        } else {
            this.input.value = suggestion;
        }

        this.closeSuggestions().then(() => this.props.onAutocomplete(suggestion));
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
        this.setSuggestionIndex(this.state.suggestionIndex + 1, e);
    }

    public previousSuggestion(e: KeyboardEvent<any>): void {
        this.setSuggestionIndex(this.state.suggestionIndex - 1, e);
    }

    public setSuggestionIndex(index: number, e?: KeyboardEvent<any>): void {
        if (e) {
            e.preventDefault();
        }

        this.setState({
            suggestionIndex: index
        });
    }

    public fireEnter(): void {
        this.props.onEnter(this.input.value);
    }

    public updateSuggestions(): void {
        if (this.props.tokenize) {
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
              limit       = Number(this.props.limit) || appConfig.autocomplete.defaultSuggestionLimit;

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

    public onChange(e: FormEvent<AutocompleteInput>): void {
        if (!e.defaultPrevented) {
            this.updateSuggestions();
        }
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
}

export default AutocompleteInput;
