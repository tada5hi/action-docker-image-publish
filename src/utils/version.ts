/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import path from 'path';
import { findVersionByLernaConfig } from './lerna';
import { findVersionByPackageJson } from './package-json';

export async function findVersionForPackage(packagePath: string, workingDirectoryPath?: string) : Promise<string | undefined> {
    workingDirectoryPath = workingDirectoryPath || process.cwd();

    let packageVersion = await findVersionByPackageJson(path.join(workingDirectoryPath, packagePath));
    if (!packageVersion) {
        packageVersion = await findVersionByLernaConfig(workingDirectoryPath);
    }

    return packageVersion;
}
