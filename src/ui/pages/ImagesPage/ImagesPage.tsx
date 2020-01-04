import React = require('react');
import {remote} from 'electron';
import {ReactNode} from 'react';
import {Link} from 'react-router-dom';
import {Image} from '../../../common/types/models/Image';
import {ImageService} from '../../services/ImageService';

const fs = remote.require('fs');
const path = remote.require('path');

export interface ImagesPageState {
    // img: string;
    images: Image[];
}

console.log(path.resolve(''));

export class ImagesPage extends React.Component<{}, ImagesPageState> {
    private readonly imageService = new ImageService();

    public constructor(props: {}) {
        super(props);

        // const img = fs.readFileSync('foo.jpg').toString('base64');
        this.state = {
            // img,
            images: [],
        };
    }

    public componentDidMount(): void {
        this.getImages();
    }

    public render(): ReactNode {
        return (
            <div className="ImagesPage">
                Images Page
                <button onClick={this.getImages}>GET Images</button>
                <button onClick={this.postImage}>POST Image</button>
                <Link to="/">Home</Link>
                <pre>{JSON.stringify(this.state.images, null, 4)}</pre>
                {/*<img src={`data:image/jpeg;base64,${this.state.img}`} alt="Image"/>*/}
            </div>
        );
    }

    private getImages = async() => {
        const images = await this.imageService.getImages();
        console.log(JSON.stringify(images, null, 4));
        this.setState({images});
    };

    private postImage = () => {
        this.imageService.createImage({
            path: 'foo.jpg',
        });
    };
}
