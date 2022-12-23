"use strict";
/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildDockerImage = void 0;
const core_1 = __importDefault(require("@actions/core"));
const instance_1 = require("./instance");
function buildDockerImage(context) {
    return __awaiter(this, void 0, void 0, function* () {
        const stream = yield (0, instance_1.useDocker)().buildImage(context.filePath, {
            t: context.tag,
            labels: context.labels || {},
        });
        core_1.default.notice('Building docker image.');
        return new Promise(((resolve, reject) => {
            (0, instance_1.useDocker)().modem.followProgress(stream, (error, output) => {
                var _a;
                if (error) {
                    core_1.default.error(error);
                    reject(error);
                    return;
                }
                const raw = output.pop();
                if (typeof ((_a = raw === null || raw === void 0 ? void 0 : raw.errorDetail) === null || _a === void 0 ? void 0 : _a.message) === 'string') {
                    core_1.default.error(raw.errorDetail.message);
                    reject(new Error(raw.errorDetail.message));
                    return;
                }
                core_1.default.info('Built docker image.');
                resolve(output);
            }, (e) => e);
        }));
    });
}
exports.buildDockerImage = buildDockerImage;
//# sourceMappingURL=image-build.js.map