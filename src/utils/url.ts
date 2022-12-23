/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

export function hasLeadingSlash(input = ''): boolean {
    return input.startsWith('/');
}

export function withoutLeadingSlash(input = ''): string {
    return (hasLeadingSlash(input) ? input.substr(1) : input) || '/';
}

export function withLeadingSlash(input = ''): string {
    return hasLeadingSlash(input) ? input : (`/${input}`);
}
