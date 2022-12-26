/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

export function trimRefName(name: string, prefix?: string) {
    if (
        prefix &&
        name.startsWith(prefix)
    ) {
        name = name.substring(prefix.length);

        if (name[0] === '@') {
            name = name.substring(1);
        }
    }

    // remove version sign
    if (name[0] === 'v') {
        name = name.substring(1);
    }

    return name;
}
