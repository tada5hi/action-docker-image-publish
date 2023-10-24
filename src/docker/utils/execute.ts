import type { ExecSyncOptions } from 'child_process';
import { execSync } from 'child_process';

export function executeDockerCommand(
    command: string,
    options?: ExecSyncOptions,
) : string {
    const output = execSync(`docker ${command}`, {
        env: process.env,
        ...(options || {}),
    });

    if (Buffer.isBuffer(output)) {
        return output.toString('utf-8');
    }

    return output;
}
