import core from '@actions/core';
import github from '@actions/github';
import { Octokit } from '../type';

let instance : Octokit;

export function useGitHubClient() : Octokit {
    if (typeof instance !== 'undefined') {
        return instance;
    }

    instance = github.getOctokit(
        core.getInput('token'),
    );

    return instance;
}

export function setupGitHubClient(secret: string) : Octokit {
    instance = github.getOctokit(secret);

    return instance;
}
