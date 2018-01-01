const path = require('path');

const root = path.resolve(__dirname, '..');

module.exports = {
    root,
    ui    : path.join(root, 'ui'),
    server: path.join(root, 'service')
};
