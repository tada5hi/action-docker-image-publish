"use strict";
/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.withLeadingSlash = exports.withoutLeadingSlash = exports.hasLeadingSlash = void 0;
function hasLeadingSlash(input = '') {
    return input.startsWith('/');
}
exports.hasLeadingSlash = hasLeadingSlash;
function withoutLeadingSlash(input = '') {
    return (hasLeadingSlash(input) ? input.substr(1) : input) || '/';
}
exports.withoutLeadingSlash = withoutLeadingSlash;
function withLeadingSlash(input = '') {
    return hasLeadingSlash(input) ? input : (`/${input}`);
}
exports.withLeadingSlash = withLeadingSlash;
//# sourceMappingURL=url.js.map