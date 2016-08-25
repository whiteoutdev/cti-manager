const loaders = [
    {
        test: /\.s?css$/,
        loaders: ['style', 'css', 'sass']
    },
    {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel'
    },
    {
        test: /\.(png|jpg|jpeg|svg|eot|ttf|woff|woff2)$/,
        loader: 'url?limit=8192'
    },
    {
        test: /\.json$/,
        loader: 'json'
    }
];

export default loaders;
