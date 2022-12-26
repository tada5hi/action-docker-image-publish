import { GithubRepository } from '../repository';
export declare function findGitHubCommitByDate(repository: GithubRepository, date: string, path?: string): Promise<string | undefined>;
