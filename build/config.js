const path = require('path');

const root = path.resolve(__dirname, '..');

module.exports = {
    root,
    ui    : path.join(root, 'cti-manager-web-ui'),
    server: path.join(root, 'cti-manager-server')
};
