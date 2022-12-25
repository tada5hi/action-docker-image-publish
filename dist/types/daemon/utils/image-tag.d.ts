import { Image } from 'dockerode';
export type ImageTagContext = {
    sourceImage: Image | string;
    destinationImage: string;
    destinationTag: string;
};
export declare function tagImage(context: ImageTagContext): Promise<Image>;
