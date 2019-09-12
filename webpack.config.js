var path = require('path');

//TODO: Build for SSR
module.exports = {
    entry: {
        editor: "./src/RichEditor.js",
    },
    target: 'node',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].js',
        sourceMapFilename: "[name].js.map",
        libraryTarget: 'commonjs2'
    },
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules|build)/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env", "@babel/preset-react"],
                        plugins: ["@babel/plugin-proposal-class-properties"]
                    },
                },
            },
            {
                test: /\.css$/,
                loaders: [
                    'to-string-loader', 'css-loader',
                ],
            },
            {
                test: /\.scss$/,
                loaders: [
                    'to-string-loader', 'css-loader', 'sass-loader',
                ],
            },
        ]
    },
    externals: {
        'react': 'commonjs react'
    }
};