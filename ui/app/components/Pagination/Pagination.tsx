import {noop} from 'lodash';
import * as React from 'react';
import {Component, ReactNode} from 'react';
import {Link} from 'react-router-dom';
import appConfig from '../../config/app.config';
import './Pagination.scss';

interface LinkInternals {
    key: string;
    content: ReactNode;
    binding: () => void;
    next: number;
    noClick?: boolean;
}

export interface PageChangeEvent {
    current: number;
    next: number;
}

export interface LinkInformation {
    pageCount: number;
    currentPage: number;
    next: number;
}

export interface PaginationProps {
    pageCount: number;
    currentPage: number;
    maxPageButtons?: number;
    onFirstClick?: (e: PageChangeEvent) => void;
    onPreviousClick?: (e: PageChangeEvent) => void;
    onPageClick?: (e: PageChangeEvent) => void;
    onNextClick?: (e: PageChangeEvent) => void;
    onLastClick?: (e: PageChangeEvent) => void;
    linkFactory?: (i: LinkInformation) => string;
}

export class Pagination extends Component<PaginationProps> {
    public static defaultProps: PaginationProps = {
        pageCount      : 1,
        currentPage    : 0,
        maxPageButtons : appConfig.pagination.maxPagesShown,
        onFirstClick   : noop,
        onPreviousClick: noop,
        onPageClick    : noop,
        onNextClick    : noop,
        onLastClick    : noop
    };

    public render(): ReactNode {
        const props = this.props;

        let minPageNav = Math.max(props.currentPage - (props.maxPageButtons - 1) / 2, 0);
        const maxPageNav              = Math.min(minPageNav + props.maxPageButtons, props.pageCount),
              navButtons: ReactNode[] = [];

        if (maxPageNav === props.pageCount) {
            minPageNav = Math.max(maxPageNav - props.maxPageButtons, 0);
        }

        for (let i = minPageNav; i < maxPageNav; i++) {
            if (i === props.currentPage) {
                navButtons.push(
                    <li className='nav-button current' key={i}><span>{i + 1}</span></li>
                );
            } else {
                navButtons.push(
                    this.renderLink({
                        key    : `${i}`,
                        content: i + 1,
                        binding: () => this.onPageButtonClick(i),
                        next   : i,
                        noClick: true
                    })
                );
            }
        }

        if (props.currentPage > 0) {
            navButtons.unshift(
                this.renderLink({
                    key    : 'firstPage',
                    content: <i className='material-icons'>first_page</i>,
                    binding: this.onFirstPageButtonClick.bind(this),
                    next   : 0
                }),
                this.renderLink({
                    key    : 'previousPage',
                    content: <i className='material-icons'>chevron_left</i>,
                    binding: this.onPreviousPageButtonClick.bind(this),
                    next   : this.props.currentPage - 1
                })
            );
        }

        if (props.currentPage < props.pageCount - 1) {
            navButtons.push(
                this.renderLink({
                    key    : 'nextPage',
                    content: <i className='material-icons'>chevron_right</i>,
                    binding: this.onNextPageButtonClick.bind(this),
                    next   : this.props.currentPage + 1
                }),
                this.renderLink({
                    key    : 'lastPage',
                    content: <i className='material-icons'>last_page</i>,
                    binding: this.onLastPageButtonClick.bind(this),
                    next   : this.props.pageCount - 1
                })
            );
        }

        return (
            <ul className='Pagination'>
                {navButtons}
            </ul>
        );
    }

    private renderLink(internals: LinkInternals): ReactNode {
        let content: ReactNode;
        if (this.props.linkFactory) {
            const info: LinkInformation = {
                pageCount  : this.props.pageCount,
                currentPage: this.props.currentPage,
                next       : internals.next
            };
            content = (
                <Link to={this.props.linkFactory(info)}>
                    {internals.content}
                </Link>
            );
        } else {
            content = (
                <button onClick={internals.binding}>
                    {internals.content}
                </button>
            );
        }

        return <li key={internals.key} className={`nav-button link ${internals.noClick ? '' : 'button-link'}`}>{content}</li>;
    }

    private onFirstPageButtonClick(): void {
        this.firePageClick(this.props.onFirstClick, 0);
    }

    private onPreviousPageButtonClick(): void {
        this.firePageClick(this.props.onPreviousClick, this.props.currentPage - 1);
    }

    private onPageButtonClick(nextPage: number): void {
        this.firePageClick(this.props.onPageClick, nextPage);
    }

    private onNextPageButtonClick(): void {
        this.firePageClick(this.props.onNextClick, this.props.currentPage + 1);
    }

    private onLastPageButtonClick(): void {
        this.firePageClick(this.props.onLastClick, this.props.pageCount - 1);
    }

    private firePageClick(callback: (e: PageChangeEvent) => void, next: number): void {
        callback({
            current: this.props.currentPage,
            next
        });
    }
}
