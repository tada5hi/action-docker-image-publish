/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import fs from 'fs';
import path from 'path';

export async function readJsonFile(
    filePath: string,
) : Promise<Record<string, any>> {
    if (!path.isAbsolute(filePath)) {
        filePath = path.resolve(process.cwd(), filePath);
    }

    try {
        await fs.promises.access(filePath, fs.constants.F_OK | fs.constants.R_OK);
    } catch (e) {
        return {};
    }

    const rawFile = await fs.promises.readFile(filePath, { encoding: 'utf-8' });
    return JSON.parse(rawFile);
}
