import { AuthConfig, Image } from 'dockerode';
export declare function pushImage(name: Image | string, authConfig: AuthConfig): Promise<void>;
