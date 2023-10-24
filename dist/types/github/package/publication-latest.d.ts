import type { Options } from '../../type';
import type { GithubRepository } from '../repository';
export declare function findGitHubPackageLatestPublicationDate(repository: GithubRepository, options: Options): Promise<string>;
