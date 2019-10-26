const path = require('path'),
      root = path.resolve(__dirname, '..'),
      src  = path.join(root, 'src'),
      dist = path.join(root, 'dist');

module.exports = {
    root,
    src,
    srcFile(filePath) {
        return path.join(src, filePath);
    },
    dist,
    distFile(filePath) {
        return path.join(dist, filePath);
    },
    index   : path.join(src, 'index.ejs'),
    main    : path.join(src, 'main.ts'),
    renderer: path.join(src, 'renderer.ts')
};
