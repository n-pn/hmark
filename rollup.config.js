import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import { uglify } from 'rollup-plugin-uglify'
import pkg from './package.json'

export default [
    // browser-friendly UMD build
    {
        input: 'src/main.js',
        output: {
            name: 'rollupJestBoilerplate',
            file: pkg.browser,
            format: 'umd',
        },
        plugins: [
            resolve(),
            commonjs(),
            babel({
                exclude: 'node_modules/**',
            }),
            uglify(),
        ],
    },

    // CommonJS (for Node) and ES module (for bundlers) build.
    {
        input: 'src/main.js',
        external: [],
        output: [
            { file: pkg.main, format: 'cjs' },
            { file: pkg.module, format: 'es' },
        ],
    },
]
