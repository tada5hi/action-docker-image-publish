export type ImageUrlBuildContext = {
    host: string;
    owner: string;
    name: string;
    tag: string;
};
export declare function buildDockerImageURL(context: ImageUrlBuildContext): string;
export declare function buildDockerImageURL(image: string, tag: string): string;
