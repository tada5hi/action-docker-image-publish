/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */
import { useDocker } from './instance';
export async function removeImage(image) {
    if (typeof image === 'string') {
        image = useDocker().getImage(image);
    }
    await image
        .remove({
        force: true,
    });
}
//# sourceMappingURL=image-remove.js.map