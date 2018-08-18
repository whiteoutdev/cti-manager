import {noop} from 'lodash';
import * as React from 'react';
import {Component, ReactNode} from 'react';
import Gallery from '../../components/Gallery/Gallery';
import ImageSidebar from '../../components/ImageSidebar/ImageSidebar';
import NavbarredPage from '../../components/NavbarredPage/NavbarredPage';
import {LinkInformation, Pagination} from '../../components/Pagination/Pagination';
import {DEFAULT_IMAGES_PAGE_STATE, ImagesPageState} from '../../redux/imagesPage/ImagesPageState';
import './ImagesPage.scss';

export interface ImagesPageProps extends ImagesPageState {
    linkFactory: (i: LinkInformation) => string;
    onSidebarUploadComplete: () => void;
}

export class ImagesPage extends Component<ImagesPageProps, {}> {
    public static defaultProps: ImagesPageProps = {
        ...DEFAULT_IMAGES_PAGE_STATE,
        linkFactory            : () => '',
        onSidebarUploadComplete: noop
    };

    public render(): ReactNode {
        return (
            <div className='ImagesPage'>
                <NavbarredPage>
                    <ImageSidebar images={this.props.images} tagLimit={30}
                                  onUploadComplete={() => this.props.onSidebarUploadComplete()}/>
                    <div className='main-section'>
                        {this.renderNavigation()}
                        <Gallery ids={this.props.images.map(file => file.id)}/>
                        {this.renderNavigation()}
                    </div>
                </NavbarredPage>
            </div>
        );
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
