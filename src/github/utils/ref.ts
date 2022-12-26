/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { GithubRef } from '../type';

export function parseGitHubRef(ref: string) : GithubRef | undefined {
    const parts = ref.split('/');
    if (parts.length < 3 || parts[0] !== 'refs') {
        return undefined;
    }

    switch (parts[1]) {
        case 'heads': {
            return {
                type: 'branch',
                value: parts.slice(2).join('/'),
            };
        }
        case 'pulls': {
            return {
                type: 'pull',
                value: parts[2],
            };
        }
        case 'tags': {
            return {
                type: 'tag',
                value: parts.slice(2).join('/'),
            };
        }
    }

    return undefined;
}
