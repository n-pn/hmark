import typescript from '@rollup/plugin-typescript'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import { uglify } from 'rollup-plugin-uglify'
import pkg from './package.json'

const ts = typescript({ lib: ['es5', 'es6', 'dom'], target: 'es5' })
export default [
    // browser-friendly UMD build
    {
        input: 'src/main.ts',
        output: {
            name: 'hmark',
            file: pkg.browser,
            format: 'umd',
        },
        plugins: [ts, resolve(), commonjs(), uglify()],
    },

    // CommonJS (for Node) and ES module (for bundlers) build.
    {
        input: 'src/main.ts',
        external: [],
        output: [
            { file: pkg.main, format: 'cjs' },
            { file: pkg.module, format: 'es' },
        ],
        plugins: [ts],
    },
]
