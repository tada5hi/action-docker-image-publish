import { Options } from '../../type';
import { GithubRepository } from '../repository';
type Context = {
    repository: GithubRepository;
    options: Options;
};
export declare function findGitHubPackageLatestPublicationDate(ctx: Context): Promise<string>;
export {};
