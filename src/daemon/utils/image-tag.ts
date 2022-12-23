/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { Image } from 'dockerode';
import { useDocker } from '../instance';

export type ImageTagContext = {
    sourceImage: Image | string,

    destinationImage: string,

    destinationTag: string
};

export async function tagImage(context: ImageTagContext) {
    const image = typeof context.sourceImage === 'string' ?
        await useDocker().getImage(context.sourceImage) :
        context.sourceImage;

    await image.tag({
        repo: context.destinationImage,
        tag: context.destinationTag,
    });

    return image;
}
