/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import fs from 'fs';
import path from 'path';
import { hasOwnProperty, isObject } from 'smob';

export async function getPackageJsonVersion(directoryPath?: string) : Promise<string | undefined> {
    const file = await readPackageJson(directoryPath);

    if (
        isObject(file) &&
        hasOwnProperty(file, 'version') &&
        typeof file.version === 'string'
    ) {
        return file.version;
    }

    return undefined;
}

export async function readPackageJson(
    directoryPath?: string,
) : Promise<Record<string, any>> {
    const filePath = path.join(directoryPath || process.cwd(), 'package.json');

    try {
        await fs.promises.access(filePath, fs.constants.F_OK | fs.constants.R_OK);
    } catch (e) {
        return {};
    }

    const rawFile = await fs.promises.readFile(filePath, { encoding: 'utf-8' });
    return JSON.parse(rawFile);
}
