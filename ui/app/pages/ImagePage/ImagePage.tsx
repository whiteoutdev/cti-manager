import * as React from 'react';
import {Component, ReactElement, ReactNode} from 'react';
import MediaApi from '../../api/MediaApi';
import {ImageSidebarConnector} from '../../components/ImageSidebar/ImageSidebarConnector';
import NavbarredPage from '../../components/NavbarredPage/NavbarredPage';
import {ImagePageState} from '../../redux/imagePage/ImagePageState';
import './ImagePage.scss';

export interface ImagePageProps extends ImagePageState {
    onTagsChange: (tags: string[]) => void;
}

export interface ImagePageComponentState {
    maximized: boolean;
}

class ImagePage extends Component<ImagePageProps, ImagePageComponentState> {
    private videoPlayer: HTMLVideoElement;

    constructor(props: ImagePageProps) {
        super(props);
        this.state = {
            maximized: false
        };
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

    public renderImage(): ReactNode {
        const image = this.props.image;

        if (image) {
            const downloadUrl = MediaApi.getMediaDownloadUrl(image.id);
            if (image.type === 'video') {
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
                         alt={this.props.image.id}
                         onClick={this.toggleMaximize.bind(this)}/>
                );
            }
        }
    }

    public render(): ReactElement<ImagePageProps> {
        return (
            <div className='ImagePage'>
                <NavbarredPage>
                    <ImageSidebarConnector tagList={this.props.image ? this.props.image.tags : []}
                                           tagsEditable
                                           uploadDisabled
                                           tagLimit={Infinity}
                                           onTagsChange={(tags: string[]) => this.props.onTagsChange(tags)}/>
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
