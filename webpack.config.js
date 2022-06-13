const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    mode: 'none',
    target: 'web',
    // devtool: 'source-map',
    entry: {
        FormGenerator: '/src/generator/generator.js',
        FormValidator: '/src/validator/validator.js',
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist/'),
        libraryTarget: 'umd',
        libraryExport: 'default',
        library: '[name]',
        umdNamedDefine: true,
    },
    plugins: [
        new CleanWebpackPlugin(),
    ],
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader',
                ],
            },
            {
                test: /\.hbs$/,
                exclude: /node_modules/,
                use: [
                    'handlebars-loader',
                ],
            },
        ],
    },
};
