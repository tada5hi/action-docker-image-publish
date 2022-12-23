/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { Image } from 'dockerode';
import { useDocker } from './instance';

export async function removeImage(image: string | Image) {
    if (typeof image === 'string') {
        image = useDocker().getImage(image);
    }

    await image
        .remove({
            force: true,
        });
}
