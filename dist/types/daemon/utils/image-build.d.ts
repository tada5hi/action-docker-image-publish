export type ImageBuildContext = {
    imageId: string;
    filePath: string;
    labels?: Record<string, string>;
};
export declare function buildImage(context: ImageBuildContext): void;
