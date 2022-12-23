"use strict";
/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDocker = void 0;
const dockerode_1 = __importDefault(require("dockerode"));
let instance;
function useDocker() {
    if (typeof instance !== 'undefined') {
        return instance;
    }
    instance = new dockerode_1.default();
    return instance;
}
exports.useDocker = useDocker;
//# sourceMappingURL=instance.js.map