import { Octokit, Options } from './type';
export declare class Runner {
    protected octokit: Octokit;
    protected options: Options;
    constructor();
    execute(): Promise<void>;
}
