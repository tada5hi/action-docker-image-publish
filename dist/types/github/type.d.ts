import type github from '@actions/github';
export type GithubRef = {
    type: 'branch' | 'tag' | 'pull';
    value: string;
};
export type GitHubClient = ReturnType<typeof github.getOctokit>;
