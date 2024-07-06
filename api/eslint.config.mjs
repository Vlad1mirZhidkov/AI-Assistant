// eslint.config.mjs
import pluginJs from '@eslint/js'; // recommended linting rools for JS

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
