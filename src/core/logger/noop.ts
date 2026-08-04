/*
 * Copyright (c) 2025-2026.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { ILogger } from './types.ts';

export class NoopLogger implements ILogger {
    debug() : void {
        // intentionally empty
    }

    info() : void {
        // intentionally empty
    }

    warn() : void {
        // intentionally empty
    }

    error() : void {
        // intentionally empty
    }
}
