const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');

module.exports = {
    entry: [
        'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true',
        path.join(__dirname, 'src', 'index.tsx')
    ],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader', options: { importLoaders: 1 } },
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            plugins: [
                                autoprefixer(),
                            ]
                        }
                    }
                ]
            },
            {
                test: /\.tsx?$/,
                use: [
                    { loader: "awesome-typescript-loader", options: { configFileName: './src/tsconfig.json' } },
                ],
            },
            {
                test: /\.html$/,
                use: {
                    loader: 'html-loader',
                    options: {
                        minimize: true,
                    }
                }
            }]
    },
    devtool: 'source-map',
    devServer: {
        contentBase: path.join(__dirname, "dist"),
    },
    plugins: [
        new HtmlWebpackPlugin({ template: './static/index.html' }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
    ],
    resolve: {
        extensions: [".json", ".ts", ".tsx", ".js", ".jsx"],
    }
};