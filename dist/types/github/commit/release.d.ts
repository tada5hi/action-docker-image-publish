import { Options } from '../../type';
import { VersionFile } from '../../version-file';
import { GithubRepository } from '../repository';
type Context = {
    options: Options;
    repository: GithubRepository;
    versionFile?: VersionFile;
};
export declare function findGitHubCommitOfLatestReleaseByPackage(ctx: Context): Promise<string | undefined>;
export declare function findGitHubCommitOfLatestReleaseByTag(ctx: Context & {
    page: number;
}): Promise<string | undefined>;
export declare function findGitHubCommitOfLatestRelease(ctx: Context): Promise<string | undefined>;
export {};
