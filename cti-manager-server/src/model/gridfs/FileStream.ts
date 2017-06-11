import {GridFSBucketReadStream} from 'mongodb';
import AbstractFile from './AbstractFile';

interface FileStream<F extends AbstractFile> {
    doc: F;
    stream: GridFSBucketReadStream;
}

export default FileStream;
