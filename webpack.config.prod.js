const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');

module.exports = {
    mode: "production",
    entry: [
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
                    MiniCssExtractPlugin.loader,
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
    plugins: [
        new HtmlWebpackPlugin({ template: './static/index.html' }),
        new webpack.NoEmitOnErrorsPlugin(),
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        }),
    ],
    resolve: {
        extensions: [".json", ".ts", ".tsx", ".js", ".jsx"],
    }
};