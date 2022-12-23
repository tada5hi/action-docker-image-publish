import github from '@actions/github';
import Dockerode, { AuthConfig } from 'dockerode';
import { Options } from './type';
export declare class Runner {
    protected client: Dockerode;
    protected octokit: ReturnType<typeof github.getOctokit>;
    protected options: Options;
    constructor();
    isPackageIncluded(): Promise<boolean>;
    getPackageVersion(): Promise<string | undefined>;
    get authConfig(): AuthConfig;
    execute(): Promise<void>;
}
