"use strict";
/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.toBoolean = void 0;
function toBoolean(input) {
    if (typeof input === 'boolean') {
        return input;
    }
    if (typeof input === 'string') {
        input = input.toLowerCase();
        if (input === 'true' || input === 't') {
            return true;
        }
        if (input === 'false' || input === 'f') {
            return false;
        }
    }
    return undefined;
}
exports.toBoolean = toBoolean;
//# sourceMappingURL=boolean.js.map