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
exports.buildOptions = void 0;
const core_1 = __importDefault(require("@actions/core"));
const github_1 = __importDefault(require("@actions/github"));
const contants_1 = require("../contants");
const boolean_1 = require("./boolean");
function buildOptions() {
    var _a;
    const imageFile = core_1.default.getInput('imagePath') || '.';
    const imageTag = core_1.default.getInput('imageTag') || undefined;
    const imageTagExtra = (_a = (0, boolean_1.toBoolean)(core_1.default.getInput('imageTagExtra'))) !== null && _a !== void 0 ? _a : false;
    const secret = core_1.default.getInput('token', { required: true });
    const packagePath = core_1.default.getInput('packagePath', { trimWhitespace: true }) || contants_1.PACKAGE_PATH_DEFAULT;
    const registryHost = core_1.default.getInput('registryHost', { trimWhitespace: true }) || contants_1.REGISTRY_GITHUB;
    const registryUser = core_1.default.getInput('registryUser', { trimWhitespace: true }) || github_1.default.context.actor;
    const registryPassword = core_1.default.getInput('registryPassword', { trimWhitespace: true }) || secret;
    const registryProject = core_1.default.getInput('registryProject', { trimWhitespace: true }) || github_1.default.context.repo.owner;
    const registryRepository = core_1.default.getInput('registryRepository', { trimWhitespace: true }) || github_1.default.context.repo.repo;
    return {
        imageFile,
        imageTag,
        imageTagExtra,
        token: secret,
        packagePath,
        registryHost,
        registryUser,
        registryPassword,
        registryProject,
        registryRepository,
    };
}
exports.buildOptions = buildOptions;
//# sourceMappingURL=options.js.map