import { Options } from '../../type';
import { GithubRepository } from '../repository';
export declare function findGitHubPackageLatestPublicationDate(repository: GithubRepository, options: Options): Promise<string>;
