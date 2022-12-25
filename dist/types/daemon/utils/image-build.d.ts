export type ImageBuildContext = {
    imageId: string;
    fileName: string;
    filePath: string;
    labels?: Record<string, string>;
};
export declare function buildImage(context: ImageBuildContext): void;
