import {noop} from 'lodash';
import * as React from 'react';
import {Component, ReactNode} from 'react';
import Gallery from '../../components/Gallery/Gallery';
import {ImageSidebarConnector} from '../../components/ImageSidebar/ImageSidebarConnector';
import NavbarredPage from '../../components/NavbarredPage/NavbarredPage';
import {LinkInformation, Pagination} from '../../components/Pagination/Pagination';
import {DEFAULT_IMAGES_PAGE_STATE, ImagesPageState} from '../../redux/imagesPage/ImagesPageState';
import './ImagesPage.scss';

export interface ImagesPageProps extends ImagesPageState {
    linkFactory: (i: LinkInformation) => string;
    onSidebarUploadComplete: () => void;
    onSidebarSearch: (tags: string[]) => void;
}

export class ImagesPage extends Component<ImagesPageProps, {}> {
    public static defaultProps: ImagesPageProps = {
        ...DEFAULT_IMAGES_PAGE_STATE,
        linkFactory            : () => '',
        onSidebarUploadComplete: noop,
        onSidebarSearch        : noop
    };

    public render(): ReactNode {
        return (
            <div className='ImagesPage'>
                <NavbarredPage>
                    <ImageSidebarConnector tagList={this.getTagList()}
                                           onSearch={this.props.onSidebarSearch}
                                           onUploadComplete={this.props.onSidebarUploadComplete}/>
                    <div className='main-section'>
                        {this.renderNavigation()}
                        <Gallery ids={this.props.images.map(file => file.id)}/>
                        {this.renderNavigation()}
                    </div>
                </NavbarredPage>
            </div>
        );
    }

    private getTagList(): string[] {
        const images = this.props.images;

        if (!images) {
            return null;
        }

        const tagCounts = images.reduce((previous, current) => {
            current.tags.forEach(tag => {
                if (previous[tag]) {
                    previous[tag] = previous[tag] + 1;
                } else {
                    previous[tag] = 1;
                }
            });
            return previous;
        }, {} as {[tag: string]: number});

        return Object.keys(tagCounts)
            .sort((t1, t2) => {
                const c1 = tagCounts[t1],
                      c2 = tagCounts[t2];
                return c1 > c2 ? -1 : c1 < c2 ? 1 : t1 < t2 ? -1 : t1 > t2 ? 1 : 0;
            });
    }

    private renderNavigation(): ReactNode {
        const imageCount  = this.props.count,
              limit       = this.props.limit,
              skip        = this.props.skip,
              pageCount   = Math.ceil(imageCount / limit),
              currentPage = Math.floor(skip / limit);

        return (
            <Pagination pageCount={pageCount}
                        currentPage={currentPage}
                        linkFactory={info => this.props.linkFactory(info)}/>
        );
    }
}
