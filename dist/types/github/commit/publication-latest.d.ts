import { Options } from '../../type';
import { VersionFile } from '../../version-file';
import { GithubRepository } from '../repository';
type Context = {
    options: Options;
    repository: GithubRepository;
    versionFile?: VersionFile;
};
export declare function findGitHubCommitByLatestPublication(ctx: Context): Promise<string | undefined>;
export {};
