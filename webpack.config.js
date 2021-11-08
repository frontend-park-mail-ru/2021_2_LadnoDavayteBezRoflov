const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
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
    FRONTEND_ADDRESS: JSON.stringify(confConst.DEBUG ?
        confConst.LOCAL_HOST : confConst.FRONTEND_RELEASE),
    FRONTEND_PORT: confConst.FRONTEND_PORT,
    BACKEND_ADDRESS: JSON.stringify(confConst.DEBUG ? confConst.LOCAL_HOST : confConst.BACKEND_RELEASE),
    BACKEND_PORT: confConst.BACKEND_PORT,
};

const devServer = {
    port: JSON.parse(confDefs.FRONTEND_PORT),
    hot: true,
    static: [DEPLOY_DIR],
    historyApiFallback: true, // Для работы роута на 404
};

const config = {
    entry: './src/index.js',
    output: {
        publicPath: '/',
        path: path.resolve(__dirname, DEPLOY_DIR),
        filename: `bundle${confConst.DEBUG ? '' : '.[contenthash]'}.js`,
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: path.resolve(__dirname, 'node_modules/'),
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
            {
                include: [
                    path.resolve(__dirname, 'src/components/'),
                    path.resolve(__dirname, 'src/views/'),
                    path.resolve(__dirname, 'src/styles/'),
                    path.resolve(__dirname, 'src/popups/'),
                ],
                test: /\.(s*)css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                ],
            },
            {
                include: [
                    path.resolve(__dirname, 'src/components/'),
                    path.resolve(__dirname, 'src/views/'),
                    path.resolve(__dirname, 'src/popups/'),
                ],
                test: /\.hbs$/,
                loader: 'handlebars-loader',
                options: {
                    helperDirs: path.resolve(__dirname, 'src/modules/Helpers'),
                },
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({filename: `style${confConst.DEBUG ? '' : '.[contenthash]'}.css`}),
        new HtmlWebpackPlugin({
            backend: `${confConst.PROTOCOL}://${JSON.parse(confDefs.BACKEND_ADDRESS)}` +
                `:${JSON.parse(confDefs.BACKEND_PORT)}`,
            scriptLoading: 'module',
            filename: 'index.html',
            template: 'src/index_template.html',
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
    devServer: confConst.DEBUG ? devServer : devServer,
};

module.exports = config;
