const rules = [
    {
        test: /\.s?css$/,
        use : [{
            loader: 'style-loader'
        }, {
            loader: 'css-loader'
        }, {
            loader: 'sass-loader'
        }]
    },
    {
        test: /\.tsx?$/,
        use : {
            loader: 'awesome-typescript-loader'
        }
    },
    {
        test: /\.(png|jpg|jpeg|svg|eot|ttf|woff|woff2)$/,
        use : {
            loader: 'url-loader?limit=8192'
        }
    },
    {
        test: /\.json$/,
        use : {
            loader: 'json-loader'
        }
    }
];

export default rules;
