/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */
export function hasLeadingSlash(input = '') {
    return input.startsWith('/');
}
export function withoutLeadingSlash(input = '') {
    return (hasLeadingSlash(input) ? input.substr(1) : input) || '/';
}
export function withLeadingSlash(input = '') {
    return hasLeadingSlash(input) ? input : (`/${input}`);
}
//# sourceMappingURL=url.js.map