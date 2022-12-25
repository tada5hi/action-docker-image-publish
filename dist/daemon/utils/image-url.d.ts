export type ImageUrlBuildContext = {
    host: string;
    owner: string;
    name: string;
    tag: string;
};
export declare function buildImageURL(context: ImageUrlBuildContext): string;
export declare function buildImageURL(image: string, tag: string): string;
