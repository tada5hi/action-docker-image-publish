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
exports.Runner = void 0;
const core_1 = __importDefault(require("@actions/core"));
const github_1 = __importDefault(require("@actions/github"));
const dockerode_1 = __importDefault(require("dockerode"));
const path_1 = __importDefault(require("path"));
const daemon_1 = require("./daemon");
const utils_1 = require("./utils");
const package_1 = require("./utils/package");
const package_json_1 = require("./utils/package-json");
class Runner {
    constructor() {
        this.options = (0, utils_1.buildOptions)();
        this.octokit = github_1.default.getOctokit(this.options.token);
        this.client = new dockerode_1.default();
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const hasChanged = yield (0, package_1.hasPackageChanged)(this.octokit, this.options);
            if (!hasChanged) {
                core_1.default.info('Package path is not included.');
                return;
            }
            const version = yield (0, package_json_1.getPackageJsonVersion)(path_1.default.join(process.cwd(), this.options.packagePath));
            if (!version) {
                core_1.default.error('The package version could not be determined.');
                return;
            }
            const imageName = `${this.options.registryHost}/${this.options.registryProject}/${this.options.registryRepository}`;
            const imageNameVersion = (0, daemon_1.buildImageURL)(imageName, version);
            yield (0, daemon_1.buildImage)({
                filePath: this.options.imageFile,
                tag: imageNameVersion,
                labels: {
                    runId: `${github_1.default.context.runId}`,
                    runNumber: `${github_1.default.context.runNumber}`,
                },
            });
            const authConfig = {
                username: this.options.registryUser,
                password: this.options.registryPassword,
                serveraddress: this.options.registryHost,
            };
            const image = yield (0, daemon_1.useDocker)().getImage(imageNameVersion);
            if (this.options.imageTag) {
                if (this.options.imageTagExtra) {
                    yield (0, daemon_1.pushImage)(image, authConfig);
                }
                const imageNameTag = (0, daemon_1.buildImageURL)(imageName, this.options.imageTag);
                yield (0, daemon_1.tagImage)({
                    sourceImage: image,
                    destinationTag: this.options.imageTag,
                    destinationImage: imageName,
                });
                yield (0, daemon_1.pushImage)(imageNameTag, authConfig);
                yield (0, daemon_1.removeImage)(imageNameTag);
            }
            else {
                yield (0, daemon_1.pushImage)(image, authConfig);
            }
            yield (0, daemon_1.removeImage)(image);
        });
    }
}
exports.Runner = Runner;
//# sourceMappingURL=module.js.map