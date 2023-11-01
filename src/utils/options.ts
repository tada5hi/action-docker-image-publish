/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import core from '@actions/core';
import github from '@actions/github';
import { REGISTRY_GITHUB } from '../contants';
import type { Options } from '../type';
import { toBoolean } from './boolean';

export function buildOptions() : Options {
    const cache = toBoolean(core.getInput('cache')) ?? false;
    const dockerFileName = core.getInput('dockerFileName') || 'Dockerfile';
    const dockerFilePath = core.getInput('dockerFilePath') || '.';

    const token = core.getInput('token');

    const gitTag = toBoolean(core.getInput('gitTag')) ?? true;
    const gitTagPrefix = core.getInput('gitTagPrefix');

    const registryHost = core.getInput('registryHost', { trimWhitespace: true }) || REGISTRY_GITHUB;
    const registryUser = core.getInput('registryUser', { trimWhitespace: true }) || github.context.actor;
    const registryPassword = core.getInput('registryPassword', { trimWhitespace: true }) || token;
    const registryProject = core.getInput('registryProject', { trimWhitespace: true }) || github.context.repo.owner;
    const registryRepository = core.getInput('registryRepository', { trimWhitespace: true }) || github.context.repo.repo;
    const registryTags = core.getInput('registryTag')
        .split('\n')
        .map((input) => input.trim())
        .filter((x) => x !== '');

    if (registryTags.length === 0) {
        registryTags.push('latest');
    }

    return {
        cache,

        dockerFileName,
        dockerFilePath,

        gitTag,
        gitTagPrefix,

        registryHost,
        registryUser,
        registryPassword,
        registryProject,
        registryRepository,
        registryTags,
    };
}
