const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CSPWebpackPlugin = require('csp-webpack-plugin');
const {DefinePlugin} = require('webpack');

const FRONTEND_ADDRESS = process.env.NODE_ENV === 'production' ? 'http://95.163.213.142:8000' :
    'http://localhost:8000/';
const BACKEND_HOST = process.env.NODE_ENV === 'production' ? '95.163.213.142' : 'localhost';
const BACKEND_PORT = 3000;

const config = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, path.join('public', 'dist')),
        filename: 'bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
            {
                test: /\.(s*)css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                ],
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({filename: 'style.css'}),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'public/index.html',
        }),
        new CSPWebpackPlugin({
            'default-src': ['\'self\'', FRONTEND_ADDRESS],
            'style-src': ['\'self\'', 'https://fonts.googleapis.com', 'http://maxcdn.bootstrapcdn.com/' +
            'font-awesome/4.7.0/css/font-awesome.min.css'],
            'font-src': ['https://fonts.gstatic.com',
                'http://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/fonts/'],
            'script-src': ['\'self\'',
                'https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js'],
            'object-src': '\'none\'',
        }),
        new DefinePlugin({
            FRONTEND_ADDRESS: JSON.stringify(DEPLOY_ADDRESS),
            BACKEND_HOST: JSON.stringify(BACKEND_HOST),
            BACKEND_PORT: JSON.stringify(BACKEND_PORT),
        })],
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
};

module.exports = config;
