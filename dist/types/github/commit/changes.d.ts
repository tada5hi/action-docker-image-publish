import type { Options } from '../../type';
import type { GithubRepository } from '../repository';
type Context = {
    repository: GithubRepository;
    options: Options;
    base: string;
    head: string;
};
export declare function checkGitHubCommitRangeForChanges(ctx: Context): Promise<boolean>;
export {};
