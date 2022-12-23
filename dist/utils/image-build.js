/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */
import core from '@actions/core';
import { useDocker } from './instance';
export async function buildDockerImage(context) {
    const stream = await useDocker().buildImage(context.filePath, {
        t: context.tag,
        labels: context.labels || {},
    });
    core.notice('Building docker image.');
    return new Promise(((resolve, reject) => {
        useDocker().modem.followProgress(stream, (error, output) => {
            if (error) {
                core.error(error);
                reject(error);
                return;
            }
            const raw = output.pop();
            if (typeof raw?.errorDetail?.message === 'string') {
                core.error(raw.errorDetail.message);
                reject(new Error(raw.errorDetail.message));
                return;
            }
            core.info('Built docker image.');
            resolve(output);
        }, (e) => e);
    }));
}
//# sourceMappingURL=image-build.js.map