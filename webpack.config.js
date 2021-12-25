const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const {InjectManifest} = require('workbox-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const {DefinePlugin} = require('webpack');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const packageJSON = require('./package.json');

const crypto = require('crypto');
const fs = require('fs');

/**
 * Высчитывает hash от содержимого файла
 * @param {String} filePath путь до файла
 * @return {String}
 */
function getFileHash(filePath) {
    const fileBuffer = fs.readFileSync(filePath);
    const hashSum = crypto.createHash('sha256');
    hashSum.update(fileBuffer);
    return hashSum.digest('hex');
}


const DEPLOY_DIR = 'dist';
const SERVER_IP = 'brrrello.ru';
const confConst = {
    LOCAL_HOST: 'localhost',
    BACKEND_RELEASE: process.env.BACKEND_RELEASE || SERVER_IP,
    BACKEND_PORT_RELEASE: 443,
    BACKEND_PORT_DEBUG: 8000,
    FRONTEND_RELEASE: process.env.FRONTEND_RELEASE || SERVER_IP,
    FRONTEND_PORT: 3001,
    DEBUG: process.env.NODE_ENV !== 'production',
    HTTP: 'http',
    HTTPS: 'https',
};

const confDefs = {
    FRONTEND_ADDRESS: JSON.stringify(confConst.DEBUG ?
        confConst.LOCAL_HOST : confConst.FRONTEND_RELEASE),
    FRONTEND_PORT: confConst.FRONTEND_PORT,
    BACKEND_ADDRESS: JSON.stringify(confConst.DEBUG ? confConst.LOCAL_HOST : confConst.BACKEND_RELEASE),
    BACKEND_PORT: confConst.DEBUG ? confConst.BACKEND_PORT_DEBUG : confConst.BACKEND_PORT_RELEASE,
    DEBUG: confConst.DEBUG,
    SCHEME: JSON.stringify(confConst.DEBUG ? confConst.HTTP : confConst.HTTPS),
    APP_VERSION: JSON.stringify(packageJSON.version),
    SW_FILE_NAME: JSON.stringify(`sw.${confConst.DEBUG ? '' : getFileHash('./src/sw.js')}.js`),
};

const devServer = {
    port: confDefs.FRONTEND_PORT,
    hot: false,
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
                    path.resolve(__dirname, 'src/'),
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
    optimization: {
        minimizer: [
            new CssMinimizerPlugin({
                parallel: true,
            }),
        ],
        minimize: true,
    },
    plugins: [
        new MiniCssExtractPlugin({filename: `style${confConst.DEBUG ? '' : '.[contenthash]'}.css`}),
        new HtmlWebpackPlugin({
            backend: confDefs.DEBUG ?
                `${JSON.parse(confDefs.SCHEME)}://${JSON.parse(confDefs.BACKEND_ADDRESS)}` +
                `:${confDefs.BACKEND_PORT}` : null,
            scriptLoading: 'module',
            filename: 'index.html',
            template: 'src/index_template.html',
        }),
        new DefinePlugin(confDefs),
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'public', 'assets'),
                    to: path.resolve(__dirname, DEPLOY_DIR, 'assets'),
                },
            ],
        }),
    ],
    mode: confConst.DEBUG ? 'development' : 'production',
    devtool: confConst.DEBUG ? 'source-map' : undefined,
    devServer: confConst.DEBUG ? devServer : devServer,
};

if (!confConst.DEBUG) {
    config.optimization.minimizer.push(new TerserPlugin());
    config.plugins.push(new InjectManifest({
        swSrc: './src/sw.js',
        swDest: JSON.parse(confDefs.SW_FILE_NAME),
        exclude: [
            /\.m?js$/,
        ],
    }));
}

module.exports = config;
