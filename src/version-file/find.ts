/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { findUpMultiple } from 'find-up';
import path from 'path';
import semver from 'semver';
import { readJsonFile } from '../utils';
import { VersionFile } from './type';

export async function findVersionFile(directory: string) : Promise<VersionFile | undefined> {
    if (!path.isAbsolute(directory)) {
        directory = path.join(process.cwd(), directory);
    }

    const files = await findUpMultiple(
        ['package.json', 'lerna.json'],
        { cwd: directory },
    );

    for (let i = 0; i < files.length; i++) {
        const fileName = path.basename(files[i]);
        const ext = path.extname(fileName);

        if (ext !== '.json') {
            continue;
        }

        const {
            version,
            private: privatePackage,
            name,
        } = await readJsonFile(files[i]);

        if (privatePackage) {
            continue;
        }

        if (!semver.valid(version)) {
            continue;
        }

        return {
            name,
            version,
            path: files[i],
        };
    }

    return undefined;
}
