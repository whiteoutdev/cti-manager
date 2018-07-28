// tslint:disable:max-classes-per-file

import * as React from 'react';
import {HotKeys} from 'react-hotkeys';

import {ReactElement, ReactNode} from 'react';
import {RouteComponentProps} from 'react-router';
import InstructionActions from '../../actions/InstructionActions';
import {InstructionTypeStore, InstructionTypeStoreState} from '../../stores/InstructionTypeStore';
import {TagStore, TagStoreState} from '../../stores/TagStore';
import {AbstractRefluxComponent} from '../AbstractComponent/AbstractComponent';

import AutocompleteInput from '../AutocompleteInput/AutocompleteInput';
import Panel from '../Panel/Panel';
import PanelBody from '../Panel/PanelBody';
import PanelHeader from '../Panel/PanelHeader';
import './InstructionsFilters.scss';

interface InstructionsFiltersBaseProps {
}

interface InstructionsFiltersProps extends InstructionsFiltersBaseProps, RouteComponentProps<{}> {
}

interface InstructionsFiltersState extends InstructionTypeStoreState, TagStoreState {
}

class InstructionsFilters extends AbstractRefluxComponent<InstructionsFiltersProps, InstructionsFiltersState> {
    private searchInput: AutocompleteInput;

    constructor(props: InstructionsFiltersProps) {
        super(props);
        this.stores = [InstructionTypeStore, TagStore];
        InstructionActions.updateInstructionTypes();
    }

    public render(): ReactElement<InstructionsFiltersProps> {
        return (
            <div className='InstructionsFilters'>
                {this.renderSearchSection()}
                {this.renderTypesSection()}
            </div>
        );
    }

    protected defaultProps(): InstructionsFiltersProps {
        return {
            match   : undefined,
            location: undefined,
            history : undefined
        };
    }

    private search(): void {
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

    private renderTypesSection(): ReactNode {
        return (
            <Panel className='types-section'>
                <PanelHeader>
                    <h2>Instruction Types</h2>
                </PanelHeader>

                <PanelBody>
                    <ul className='type-list'>
                        {this.state.instructionTypes.map(type => <li>{type.code}</li>)}
                    </ul>
                </PanelBody>
            </Panel>
        );
    }
}

// Workaround to prevent having to pass in RouteComponentProps when using the InstructionsFilters externally
export default class extends React.Component<InstructionsFiltersBaseProps, {}> {
    public render(): ReactElement<InstructionsFiltersBaseProps> {
        return (
            <InstructionsFilters {...this.props as any}/>
        );
    }
}
