import path from 'path';

const root = path.resolve(__dirname, '..');

export default {
    root,
    src: path.join(root, 'src'),
    lib: path.join(root, 'lib')
};
