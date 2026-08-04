/*
 * Copyright (c) 2025-2026.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { CommandResult } from './types.ts';

export class CommandError extends Error {
    readonly command : string;

    readonly args : string[];

    readonly result : CommandResult | undefined;

    constructor(
        message: string,
        command: string,
        args: string[],
        result?: CommandResult,
        options?: ErrorOptions,
    ) {
        super(message, options);

        this.name = 'CommandError';
        this.command = command;
        this.args = args;
        this.result = result;
    }

    static exitedNonZero(command: string, args: string[], result: CommandResult) : CommandError {
        const detail = result.stderr.trim() || result.stdout.trim();

        return new CommandError(
            `The command ${command} failed with exit code ${result.code}.${detail ? `\n${detail}` : ''}`,
            command,
            args,
            result,
        );
    }

    static spawnFailed(command: string, args: string[], cause: Error) : CommandError {
        return new CommandError(
            `The command ${command} could not be spawned: ${cause.message}`,
            command,
            args,
            undefined,
            { cause },
        );
    }
}
