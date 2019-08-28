var path = require('path');
module.exports = {
    entry: {
        editor: "./src/RichEditor.js",
        exporter: "./src/export/exporter.js",
        dev: "./src/dev.js",
    },
    target: 'node',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].js',
        libraryTarget: 'commonjs2'
    },
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
                    'style-loader', 'css-loader',
                ],
            },
        ]
    },
    externals: {
        'react': 'commonjs react'
    }
};