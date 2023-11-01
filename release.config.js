const base = require('@tada5hi/semantic-release');

module.exports = {
    extends: '@tada5hi/semantic-release',
    plugins: [
        ...base.plugins,
        'semantic-release-major-tag'
    ]
};
