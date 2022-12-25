import { Options } from './type';
export declare class Runner {
    protected options: Options;
    constructor();
    execute(): Promise<void>;
}
