import { ExecSyncOptions, execSync } from 'child_process';

export function executeDockerCommand(
    command: string,
    options?: ExecSyncOptions,
) {
    execSync(`docker ${command}`, {
        env: process.env,
        ...(options || {}),
    });
}
