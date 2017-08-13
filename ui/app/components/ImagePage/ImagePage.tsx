import * as React from 'react';

import NavbarredPage from '../NavbarredPage/NavbarredPage';
import ImageSidebar from '../ImageSidebar/ImageSidebar';

import appConfig from '../../config/app.config';
import MediaApi from '../../api/MediaApi';
import TagActions from '../../actions/TagActions';

import './ImagePage.scss';
import {RouteComponentProps} from 'react-router';
import Media from '../../model/media/Media';

interface ImagePageRouteParams {
    imageID: string;
}

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

    updateTags(tags: string[]) {
        MediaApi.setTags(this.getImageID(), tags)
            .then((media) => {
                this.setState({media}, () => {
                    TagActions.updateTags();
                });
            });
    }

    getImage(props: ImagePageProps) {
        const imageId = this.getImageID(props);
        MediaApi.getMedia(imageId).then((media) => {
            this.setState({media});
        });
    }

    getImageID(props?: ImagePageProps): string {
        props = props || this.props;
        return props.match.params.imageID;
    }

    toggleMaximize() {
        this.setState({
            maximized: !this.state.maximized
        });
    }

    toggleVideoPause() {
        const player = this.videoPlayer;
        if (player.paused) {
            player.play();
        } else {
            player.pause();
        }
    }

    componentDidMount() {
        this.getImage(this.props);
    }

    renderImage() {
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

    render() {
        return (
            <div className="ImagePage">
                <NavbarredPage>
                    <ImageSidebar images={this.state.media ? [this.state.media] : []}
                                  uploadDisabled
                                  tagsEditable
                                  onTagsChange={this.updateTags.bind(this)}/>
                    <div className="image-section">
                        <div className="image-container">
                            {this.renderImage()}
                        </div>
                    </div>
                </NavbarredPage>
            </div>
        );
    }
}

export default ImagePage;
