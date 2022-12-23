export type ImageBuildContext = {
    tag: string;
    filePath: string;
    labels?: Record<string, string>;
};
export declare function buildDockerImage(context: ImageBuildContext): Promise<any>;
