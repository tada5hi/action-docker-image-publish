import { execSync } from 'child_process';

export function executeDockerCommand(
    command: string,
    options: [string, string][] = [],
) {
    const parts : string[] = [];
    for (let i = 0; i < options.length; i++) {
        const [key, value] = options[i];

        parts.push(`--${key} ${value}`);
    }

    if (parts.length > 0) {
        command += ` ${parts.join(' ')}`;
    }

    execSync(`docker ${command}`, {
        env: process.env,
    });
}
