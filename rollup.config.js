import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import autoExternal from 'rollup-plugin-auto-external'
import postcss from 'rollup-plugin-postcss'

import pkg from './package.json'

export default {
    input: 'src/index.js',
    plugins: [
        autoExternal(),
        resolve(),

        postcss({
            extract: true,
        }),

        babel({
            exclude: 'node_modules/**',
            presets: ["@babel/preset-react"],
            plugins: [
                "@babel/plugin-proposal-class-properties",
                "@babel/plugin-proposal-object-rest-spread"
            ]
        }),
    ],
    output: [
        {
            file: pkg.module,
            format: 'es'
        },

    ]
};