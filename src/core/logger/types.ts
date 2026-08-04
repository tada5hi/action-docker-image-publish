/*
 * Copyright (c) 2025-2026.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

export interface ILogger {
    debug(message: string) : void;

    info(message: string) : void;

    warn(message: string) : void;

    error(message: string | Error) : void;
}
