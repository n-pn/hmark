import typescript from '@rollup/plugin-typescript'
import { uglify } from 'rollup-plugin-uglify'
import pkg from './package.json'

export default [
    // browser-friendly UMD build
    {
        input: 'src/main.ts',
        output: {
            name: 'hmark',
            file: pkg.browser,
            format: 'umd',
        },
        plugins: [
            typescript({ lib: ['es5', 'es6', 'dom'], target: 'es5' }),
            uglify(),
        ],
    },

    // CommonJS (for Node) and ES module (for bundlers) build.
    {
        input: 'src/main.ts',
        external: [],
        output: [
            { file: pkg.main, format: 'cjs' },
            { file: pkg.module, format: 'es' },
        ],
        plugins: [typescript({ target: 'es6' })],
    },
]
