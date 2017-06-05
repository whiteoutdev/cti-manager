import AbstractFile from './AbstractFile';
import {GridFSBucketReadStream} from 'mongodb';

interface FileStream<F extends AbstractFile> {
    doc: F;
    stream: GridFSBucketReadStream;
}

export default FileStream;
