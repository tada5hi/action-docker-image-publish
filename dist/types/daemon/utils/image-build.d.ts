export type ImageBuildContext = {
    tag: string;
    filePath: string;
    labels?: Record<string, string>;
};
export declare function buildImage(context: ImageBuildContext): Promise<any>;
