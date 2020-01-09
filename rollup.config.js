import pkg from './package.json'
import tsc from '@rollup/plugin-typescript'

export default [
    {
        input: 'src/main.ts',
        external: [],
        output: [
            { file: pkg.main, format: 'cjs' },
            { file: pkg.module, format: 'es' },
        ],
        plugins: [tsc({ target: 'es6' })],
    },
]
