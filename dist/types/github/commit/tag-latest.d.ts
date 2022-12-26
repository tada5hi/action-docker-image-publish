import { GithubRepository } from '../repository';
export declare function findGitHubCommitForLatestTag(repository: GithubRepository, tagPrefix?: string): Promise<string | undefined>;
