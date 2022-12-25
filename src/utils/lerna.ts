/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import semver from 'semver';
import path from 'path';
import { hasOwnProperty, isObject } from 'smob';
import { readJsonFile } from './json-file';

export async function findVersionByLernaConfig(directoryPath?: string) : Promise<string | undefined> {
    const file = await readLernaConfig(directoryPath);

    if (
        isObject(file) &&
        hasOwnProperty(file, 'version') &&
        typeof file.version === 'string' &&
        semver.valid(file.version)
    ) {
        return file.version;
    }

    return undefined;
}

export function readLernaConfig(
    directoryPath?: string,
) : Promise<Record<string, any>> {
    const filePath = path.join(directoryPath || process.cwd(), 'lerna.json');
    return readJsonFile(filePath);
}
