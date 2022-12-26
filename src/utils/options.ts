/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import core from '@actions/core';
import github from '@actions/github';
import { REGISTRY_GITHUB } from '../contants';
import { Options } from '../type';
import { withoutLeadingSlash } from './url';

export function buildOptions() : Options {
    const dockerFileName = core.getInput('dockerFileName') || 'Dockerfile';
    const dockerFilePath = core.getInput('dockerFilePath') || '.';

    const imageTag = core.getInput('imageTag') || 'latest';

    const token = core.getInput('token', { required: true });

    let path = core.getInput('path', { trimWhitespace: true });
    if (path.length > 0) {
        path = withoutLeadingSlash(path);
    }
    const ignores = core.getInput('ignores').split(',');

    const registryHost = core.getInput('registryHost', { trimWhitespace: true }) || REGISTRY_GITHUB;
    const registryUser = core.getInput('registryUser', { trimWhitespace: true }) || github.context.actor;
    const registryPassword = core.getInput('registryPassword', { trimWhitespace: true }) || token;
    const registryProject = core.getInput('registryProject', { trimWhitespace: true }) || github.context.repo.owner;
    const registryRepository = core.getInput('registryRepository', { trimWhitespace: true }) || github.context.repo.repo;

    const tagPrefix = core.getInput('tagPrefix');

    return {
        dockerFileName,
        dockerFilePath,

        registryTag: imageTag,

        token,
        path,
        ignores,

        registryHost,
        registryUser,
        registryPassword,
        registryProject,
        registryRepository,

        gitTagPrefix: tagPrefix,
    };
}
