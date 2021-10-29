const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const {DefinePlugin} = require('webpack');

const DEPLOY_DIR = 'dist';
const SERVER_IP = '95.163.213.142';
const confConst = {
    LOCAL_HOST: 'localhost',
    BACKEND_RELEASE: process.env.BACKEND_RELEASE || SERVER_IP,
    BACKEND_PORT: process.env.BACKEND_PORT || 8000,
    FRONTEND_RELEASE: process.env.FRONTEND_RELEASE || SERVER_IP,
    FRONTEND_PORT: process.env.FRONTEND_PORT || 3000,
    DEBUG: process.env.NODE_ENV !== 'production',
    PROTOCOL: process.env.PROTOCOL || 'http',
};

const confDefs = {
    FRONTEND_ADDRESS: JSON.stringify(`${confConst.PROTOCOL}://` +
        `${confConst.DEBUG ? confConst.LOCAL_HOST : confConst.FRONTEND_RELEASE}`),
    FRONTEND_PORT: confConst.FRONTEND_PORT,
    BACKEND_ADDRESS: JSON.stringify(`${confConst.PROTOCOL}://` +
        `${confConst.DEBUG ? confConst.LOCAL_HOST : confConst.BACKEND_RELEASE}`),
    BACKEND_PORT: confConst.BACKEND_PORT,
};

const config = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, DEPLOY_DIR),
        filename: 'bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
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
            backendAddress: JSON.parse(confDefs.BACKEND_ADDRESS),
            backendPort: JSON.parse(confDefs.BACKEND_PORT),
            scriptLoading: 'module',
            filename: 'index.html',
            template: 'public/index_template.html',
        }),
        new DefinePlugin(confDefs),
        new CopyPlugin([
            {
                from: path.resolve(__dirname, 'public', 'assets'),
                to: path.resolve(__dirname, DEPLOY_DIR, 'assets'),
            },
        ]),
    ],
    mode: confConst.DEBUG ? 'development' : 'production',
    devtool: confConst.DEBUG ? 'source-map' : undefined,
};

module.exports = config;
