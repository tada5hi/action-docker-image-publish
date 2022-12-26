export type ImageBuildContext = {
    imageId: string;
    fileName: string;
    filePath: string;
    labels?: Record<string, string>;
};
export declare function buildDockerImage(context: ImageBuildContext): void;
