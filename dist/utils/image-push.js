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
exports.pushImage = void 0;
const core_1 = __importDefault(require("@actions/core"));
const instance_1 = require("./instance");
function pushImage(name, authConfig) {
    return __awaiter(this, void 0, void 0, function* () {
        const image = typeof name === 'string' ?
            yield (0, instance_1.useDocker)().getImage(name) :
            name;
        const stream = yield image.push({
            authconfig: authConfig,
        });
        core_1.default.notice('Pushing image.');
        yield new Promise((resolve, reject) => {
            (0, instance_1.useDocker)().modem.followProgress(stream, (err, res) => {
                if (err) {
                    core_1.default.error(err);
                    return reject(err);
                }
                core_1.default.info('Pushed image');
                return resolve(res);
            });
        });
    });
}
exports.pushImage = pushImage;
//# sourceMappingURL=image-push.js.map