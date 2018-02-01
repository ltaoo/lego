const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: __dirname + '/dist',
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['babel-preset-env']
                }
            }
        }, {
            test: /\.(png|jpg|jpe?g|gif|svg)$/,
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 4096,
                }
            }]
        }, {
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: "css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]"
            })
        }]
    },
    externals: {
        react: 'React',
        'react-dom': 'ReactDOM',
        antd: 'antd'
    },
    plugins: [
        new ExtractTextPlugin("styles.css"),
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            filename: 'index.html',
            allChunks: true,
        })
    ],
}