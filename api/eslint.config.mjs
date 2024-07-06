// eslint.config.mjs
import pluginJs from '@eslint/js';
import globals from 'globals';

const config = [
    {
        languageOptions: {
            globals: {
                process: true,
            },
        },
        plugins: {
            '@eslint/js': pluginJs,
        },
        rules: {
        },
    },
    {
        files: ['**/*.js'],
        rules: {
        },
    },
];

export default config;
