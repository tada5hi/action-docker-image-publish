import type { Options } from '../../type';
import type { GithubRepository } from '../repository';
export declare function findGitHubCommitByLatestPublication(repository: GithubRepository, options: Options): Promise<string | undefined>;
