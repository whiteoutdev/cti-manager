const loaders = [
    {
        test   : /\.s?css$/,
        loaders: ['style', 'css', 'sass']
    },
    {
        test   : /\.jsx?$/,
        exclude: /node_modules/,
        loader : 'babel'
    }
];

export default loaders;
