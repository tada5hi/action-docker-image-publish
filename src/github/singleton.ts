import core from '@actions/core';
import github from '@actions/github';
import { GitHubClient } from './type';

let instance : GitHubClient;

export function useGitHubClient() : GitHubClient {
    if (typeof instance !== 'undefined') {
        return instance;
    }

    instance = github.getOctokit(
        core.getInput('token'),
    );

    return instance;
}

export function setupGitHubClient(secret: string) : GitHubClient {
    instance = github.getOctokit(secret);

    return instance;
}
