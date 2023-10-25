/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import core from '@actions/core';
import { execute } from './module';

Promise.resolve()
    .then(execute)
    .catch((err) => {
        if (err instanceof Error) {
            core.setFailed(err.message);
        }
    });
