/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

export function toBoolean(input: unknown) : boolean | undefined {
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
