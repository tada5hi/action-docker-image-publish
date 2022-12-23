/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

export function strToBooL(input: string) : boolean | undefined {
    input = input.toLowerCase();

    if (input === 'true' || input === 't') {
        return true;
    }

    if (input === 'false' || input === 'f') {
        return false;
    }

    return undefined;
}
