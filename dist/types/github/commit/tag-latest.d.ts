import { VersionFile } from '../../version-file';
import { GithubRepository } from '../repository';
export declare function findGitHubCommitForLatestTag(repository: GithubRepository, versionFile?: VersionFile): Promise<string | undefined>;
