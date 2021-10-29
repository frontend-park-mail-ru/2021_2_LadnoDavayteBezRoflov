const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {DefinePlugin} = require('webpack');

const SERVER_IP = '95.163.213.142';
const confConst = {
    LOCAL_HOST: 'localhost',
    BACKEND_RELEASE: process.env.BACKEND_RELEASE ? process.env.BACKEND_RELEASE : SERVER_IP,
    BACKEND_PORT_RELEASE: 8000,
    BACKEND_PORT_DEBUG: 8000,
    FRONTEND_RELEASE: process.env.FRONTEND_RELEASE ? process.env.BACKEND_RELEASE : SERVER_IP,
    FRONTEND_PORT_RELEASE: 3000,
    FRONTEND_PORT_DEBUG: 3000,
    DEBUG: process.env.NODE_ENV !== 'production',
    PROTOCOL: process.env.PROTOCOL === 'secure' ? 'https' : 'http',
};

const confDefs = {
    FRONTEND_ADDRESS
    FRONTEND_PORT
    BACKEND_ADDRESS
    BACKEND_PORT

    FRONTEND_ADDRESS: JSON.stringify(confConst.DEBUG ? `${confConst.PROTOCOL}://` +
        `${confConst.LOCAL_HOST}` : `${confConst.PROTOCOL}://${confConst.FRONTEND_RELEASE}`), // origin
    BACKEND_ADDRESS: JSON.stringify(confConst.DEBUG ?
        `${confConst.PROTOCOL}://${confConst.LOCAL_HOST}:${confConst.BACKEND_PORT_DEBUG}` :
        `${confConst.PROTOCOL}://${confConst.BACKEND_RELEASE}:${confConst.BACKEND_PORT_RELEASE}`), // CSP
    BACKEND_HOST: JSON.stringify(confConst.DEBUG ?
        confConst.LOCAL_HOST : confConst.BACKEND_RELEASE), // Constants
    BACKEND_PORT: JSON.stringify(confConst.DEBUG ?
        confConst.BACKEND_PORT_DEBUG : confConst.BACKEND_PORT_RELEASE), // Constants
};

const config = {

    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
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
            scriptLoading: 'module',
            filename: 'index.html',
            template: 'public/index_template.html',
        }),
        new DefinePlugin(confDefs),
    ],
    mode: confConst.DEBUG ? 'development' : 'production',
    devtool: confConst.DEBUG ? 'source-map' : undefined,
    devtool: 'source-map',
};

module.exports = config;
