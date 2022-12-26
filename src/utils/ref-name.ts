/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import semver from 'semver';

export function trimRefName(name: string, prefix?: string) {
    if (
        prefix &&
        name.startsWith(prefix)
    ) {
        name = name.substring(prefix.length);

        // monorepo tag support
        if (
            name[0] === '@' &&
            semver.valid(name.substring(1))
        ) {
            return name.substring(1);
        }

        // monorepo tag support with version sign
        if (
            name[0] === '@' &&
            name[1] === 'v' &&
            semver.valid(name.substring(2))
        ) {
            return name.substring(2);
        }
    }

    // remove version sign
    // for semver version tag
    if (
        name[0] === 'v' &&
        semver.valid(name.substring(1))
    ) {
        name = name.substring(1);
    }

    return name;
}
