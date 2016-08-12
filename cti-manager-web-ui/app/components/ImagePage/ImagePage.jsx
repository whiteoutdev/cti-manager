import React from 'react';
import {Link} from 'react-router';

import NavbarredPage from '../NavbarredPage/NavbarredPage.jsx';
import ImageSidebar from '../ImageSidebar/ImageSidebar.jsx';

import appConfig from '../../config/app.config';
import ImagesApi from '../../api/ImagesApi';
import TagActions from '../../actions/TagActions';

import './ImagePage.scss';

export default class ImagePage extends React.Component {
    constructor() {
        super();
        this.state = {
            image    : null,
            maximized: false
        };
    }

    updateTags(tags) {
        ImagesApi.setTags(this.props.routeParams.imageID, tags).then((image) => {
            this.setState({image}, () => {
                TagActions.updateTags();
            });
        });
    }

    getImage(props) {
        const imageId = props.routeParams.imageID;
        ImagesApi.getImage(imageId).then((image) => {
            this.setState({image});
        });
    }

    toggleMaximize() {
        this.setState({
            maximized: !this.state.maximized
        });
    }

    componentDidMount() {
        this.getImage(this.props);
    }

    renderImage() {
        if (this.state.image) {
            const downloadUrl = `${appConfig.api.path}/images/${this.state.image.id}/download`;
            return (
                <img className={this.state.maximized ? 'max' : ''}
                     src={downloadUrl}
                     alt={this.state.image.id}
                     onClick={this.toggleMaximize.bind(this)}/>
            );
        }
    }

    render() {
        return (
            <div className="ImagePage">
                <NavbarredPage>
                    <ImageSidebar images={this.state.image ? [this.state.image] : []}
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
};
