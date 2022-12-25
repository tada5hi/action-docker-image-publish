/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import core from '@actions/core';
import github from '@actions/github';
import { PACKAGE_PATH_DEFAULT, REGISTRY_GITHUB } from '../contants';
import { Options } from '../type';
import { toBoolean } from './boolean';

export function buildOptions() : Options {
    const dockerFileName = core.getInput('dockerFileName') || 'Dockerfile';
    const dockerFilePath = core.getInput('dockerFilePath') || '.';

    const imageTag = core.getInput('imageTag') || undefined;
    const imageTagExtra = toBoolean(core.getInput('imageTagExtra')) ?? false;

    const secret = core.getInput('token', { required: true });
    const packagePath = core.getInput('packagePath', { trimWhitespace: true }) || PACKAGE_PATH_DEFAULT;

    const registryHost = core.getInput('registryHost', { trimWhitespace: true }) || REGISTRY_GITHUB;
    const registryUser = core.getInput('registryUser', { trimWhitespace: true }) || github.context.actor;
    const registryPassword = core.getInput('registryPassword', { trimWhitespace: true }) || secret;
    const registryProject = core.getInput('registryProject', { trimWhitespace: true }) || github.context.repo.owner;
    const registryRepository = core.getInput('registryRepository', { trimWhitespace: true }) || github.context.repo.repo;

    return {
        dockerFileName,
        dockerFilePath,

        imageTag,
        imageTagExtra,

        token: secret,
        packagePath,

        registryHost,
        registryUser,
        registryPassword,
        registryProject,
        registryRepository,
    };
}
