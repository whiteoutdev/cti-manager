import * as React from 'react';

import ImageSidebar from '../ImageSidebar/ImageSidebar';
import NavbarredPage from '../NavbarredPage/NavbarredPage';

import TagActions from '../../actions/TagActions';
import MediaApi from '../../api/MediaApi';
import appConfig from '../../config/app.config';

import {ReactElement, ReactNode} from 'react';
import {RouteComponentProps} from 'react-router';
import Media from '../../model/media/Media';
import './ImagePage.scss';

interface ImagePageRouteParams {
    imageID: string;
}

// tslint:disable-next-line:no-empty-interface
interface ImagePageProps extends RouteComponentProps<ImagePageRouteParams> {
}

interface ImagePageState {
    media: Media;
    maximized: boolean;
}

class ImagePage extends React.Component<ImagePageProps, ImagePageState> {
    private videoPlayer: HTMLVideoElement;

    constructor() {
        super();
        this.state = {
            media    : null,
            maximized: false
        };
    }

    public updateTags(tags: string[]): Promise<void> {
        return MediaApi.setTags(this.getImageID(), tags)
            .then(media => {
                this.setState({media}, () => {
                    TagActions.updateTags();
                });
            });
    }

    public getImage(props: ImagePageProps): Promise<void> {
        const imageId = this.getImageID(props);
        return MediaApi.getMedia(imageId)
            .then(media => {
                this.setState({media});
            });
    }

    public getImageID(props?: ImagePageProps): string {
        props = props || this.props;
        return props.match.params.imageID;
    }

    public toggleMaximize(): void {
        this.setState({
            maximized: !this.state.maximized
        });
    }

    public toggleVideoPause(): void {
        const player = this.videoPlayer;
        if (player.paused) {
            player.play();
        } else {
            player.pause();
        }
    }

    public componentDidMount(): Promise<void> {
        return this.getImage(this.props);
    }

    public renderImage(): ReactNode {
        const media = this.state.media;

        if (media) {
            const downloadUrl = `${appConfig.api.path}/media/${media.id}/download`;
            if (media.type === 'video') {
                return (
                    <video ref={video => this.videoPlayer = video}
                           src={downloadUrl}
                           autoPlay
                           controls
                           muted
                           loop
                           onClick={this.toggleVideoPause.bind(this)}/>
                );
            } else {
                return (
                    <img className={this.state.maximized ? 'max' : ''}
                         src={downloadUrl}
                         alt={this.state.media.id}
                         onClick={this.toggleMaximize.bind(this)}/>
                );
            }
        }
    }

    public render(): ReactElement<ImagePageProps> {
        return (
            <div className='ImagePage'>
                <NavbarredPage>
                    <ImageSidebar images={this.state.media ? [this.state.media] : []}
                                  uploadDisabled
                                  tagsEditable
                                  onTagsChange={this.updateTags.bind(this)}/>
                    <div className='image-section'>
                        <div className='image-container'>
                            {this.renderImage()}
                        </div>
                    </div>
                </NavbarredPage>
            </div>
        );
    }
}

export default ImagePage;
