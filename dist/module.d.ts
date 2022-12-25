import Dockerode from 'dockerode';
import { Octokit, Options } from './type';
export declare class Runner {
    protected client: Dockerode;
    protected octokit: Octokit;
    protected options: Options;
    constructor();
    execute(): Promise<void>;
}
