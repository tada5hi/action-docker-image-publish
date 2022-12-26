import { Options } from '../../type';
import { GithubRepository } from '../repository';
export declare function findGitHubCommitByLatestPublication(repository: GithubRepository, options: Options): Promise<string | undefined>;
