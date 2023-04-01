const path = require('path');
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
    entry: './/FSDK_SentryIntegration.js',
    mode: 'production',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'FSDK_SentryIntegration.js',
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    format: {
                        comments: /^\s*\/\*\*\s*\n(?:\s*\*\s*@[\w\s-]+\n)*\s*\*\//gm,
                    },
                },
                extractComments: true,
            }),
        ],
    },
};