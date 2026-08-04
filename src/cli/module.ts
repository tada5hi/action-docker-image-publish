/*
 * Copyright (c) 2026.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { defineCommand } from 'citty';
import process from 'node:process';
import {
    ConsolaLogger,
    DockerCLIClient,
    GitCLIClient,
    NodeCommandRunner,
} from '../core/index.ts';
import { publish } from '../module.ts';
import { buildOptionsFromArgs } from './options.ts';
import { PUBLISH_COMMAND_ARGS } from './args.ts';

export function createCLIEntryPointCommand() {
    return defineCommand({
        meta: {
            name: 'dimp',
            description: 'Build, tag and push docker images, with the tags derived from the git ref.',
        },
        args: PUBLISH_COMMAND_ARGS,
        async run(context) {
            const logger = new ConsolaLogger();
            const options = buildOptionsFromArgs(context.args);

            const runner = new NodeCommandRunner({ stream: (chunk) => process.stdout.write(chunk) });

            // A failed publish is user/environment error. Report the message
            // and stop, instead of letting citty print a stack trace.
            try {
                const result = await publish(options, {
                    docker: new DockerCLIClient(runner),
                    git: new GitCLIClient(runner),
                    logger,
                });

                for (const image of result.images) {
                    logger.info(`Published ${image}`);
                }
            } catch (error) {
                logger.error(error instanceof Error ? error.message : `${error}`);
                process.exit(1);
            }
        },
    });
}
