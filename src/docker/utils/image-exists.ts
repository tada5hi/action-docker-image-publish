/*
 * Copyright (c) 2023.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { executeDockerCommand } from './execute';

export async function checkDockerImage(image: string) : Promise<boolean> {
    const output = await executeDockerCommand(`images -q ${image}`);

    return output.length > 0;
}
