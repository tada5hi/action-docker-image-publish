/*
 * Copyright (c) 2025-2026.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import consola from 'consola';
import type { ILogger } from './types.ts';

export class ConsolaLogger implements ILogger {
    debug(message: string) : void {
        consola.debug(message);
    }

    info(message: string) : void {
        consola.info(message);
    }

    warn(message: string) : void {
        consola.warn(message);
    }

    error(message: string | Error) : void {
        consola.error(message);
    }
}
