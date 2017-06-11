import path from 'path';

const root = path.resolve(__dirname, '..');

export default {
    root,
    app      : {
        path: path.join(root, 'app'),
        get indexEjs() {
            return path.join(this.path, 'index.ejs')
        }
    },
    dist     : {
        path: path.join(root, 'dist')
    },
    server   : {
        port: 3000
    },
    devServer: {
        host: 'localhost',
        port: 8080
    }
};
