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
          'eslint-plugin-junit': {
              outputFile: 'reports/lint-report.xml',
          },
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
