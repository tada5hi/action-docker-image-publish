/*
 * Copyright (c) 2025.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import core from '@actions/core';
import type { ExecSyncOptions } from 'child_process';
import { exec } from 'node:child_process';

export function executeDockerCommand(
    command: string,
    options?: ExecSyncOptions,
) : Promise<string> {
    let output = '';

    return new Promise((resolve, reject) => {
        const child = exec(`docker ${command}`, {
            env: process.env,
            ...(options || {}),
        }, (err, stdout, stderr) => {
            if (err) {
                core.error(err);
                return;
            }

            if (
                stdout &&
                stdout.length > 0
            ) {
                core.info(stdout);

                output += stdout;
            }

            if (stderr && stderr.length > 0) {
                core.error(stderr);
            }
        });

        child.on('close', (code) => {
            if (code === 0) {
                resolve(output);
            } else {
                reject(new Error(`Docker command ${command} execution failed.`));
            }
        });
    });
}
