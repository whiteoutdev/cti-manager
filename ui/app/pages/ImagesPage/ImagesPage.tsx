import {noop} from 'lodash';
import * as React from 'react';
import {Component, ReactNode} from 'react';
import ImageSidebar from '../../components/ImageSidebar/ImageSidebar';
import NavbarredPage from '../../components/NavbarredPage/NavbarredPage';
import Media from '../../model/media/Media';
import {DEFAULT_IMAGES_PAGE_STATE, ImagesPageState} from '../../redux/imagesPage/ImagesPageState';
import './ImagesPage.scss';
import Gallery from './ImagesPageThumbnailGallery';

export interface ImagesPageProps extends ImagesPageState {
    onSidebarUploadComplete: () => void;
}

export class ImagesPage extends Component<ImagesPageProps, {}> {
    public static defaultProps: ImagesPageProps = {
        ...DEFAULT_IMAGES_PAGE_STATE,
        onSidebarUploadComplete: noop
    };

    public render(): ReactNode {
        return (
            <div className='ImagesPage'>
                <NavbarredPage>
                    <ImageSidebar images={this.props.images} tagLimit={30}
                                  onUploadComplete={() => this.props.onSidebarUploadComplete()}/>
                    <Gallery ids={this.props.images.map((file: Media) => file.id)}
                             skip={this.props.skip}
                             limit={this.props.limit}
                             count={this.props.count}
                             query={this.props.tagsQuery}/>
                </NavbarredPage>
            </div>
        );
    }
}
