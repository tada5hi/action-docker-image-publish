"use strict";
/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const fs = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
const smob_1 = require("smob");
const utils_1 = require("./utils");
class Runner {
    constructor() {
        this.options = (0, utils_1.buildOptions)();
        this.octokit = github_1.default.getOctokit(this.options.token);
        this.client = new dockerode_1.default();
    }
    isPackageIncluded() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.options.packagePath === '.') {
                return true;
            }
            const packagePath = (0, utils_1.withoutLeadingSlash)(this.options.packagePath);
            const commit = yield this.octokit.rest.repos.getCommit({
                owner: github_1.default.context.repo.owner,
                repo: github_1.default.context.repo.repo,
                ref: github_1.default.context.ref,
            });
            for (let i = 0; i < commit.data.files.length; i++) {
                if (commit.data.files[i].filename.startsWith(packagePath)) {
                    return true;
                }
            }
            return false;
        });
    }
    getPackageVersion() {
        return __awaiter(this, void 0, void 0, function* () {
            const filePath = path_1.default.join(process.cwd(), this.options.packagePath, 'package.json');
            try {
                yield fs.promises.access(filePath, fs.constants.F_OK | fs.constants.R_OK);
            }
            catch (e) {
                return undefined;
            }
            const rawFile = yield fs.promises.readFile(filePath, { encoding: 'utf-8' });
            const file = JSON.parse(rawFile);
            if ((0, smob_1.isObject)(file) &&
                (0, smob_1.hasOwnProperty)(file, 'version') &&
                typeof file.version === 'string') {
                return file.version;
            }
            return undefined;
        });
    }
    get authConfig() {
        return {
            username: this.options.registryUser,
            password: this.options.registryPassword,
            serveraddress: this.options.registryHost,
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const isIncluded = yield this.isPackageIncluded();
            if (!isIncluded) {
                core_1.default.info('Package path is not included.');
                return;
            }
            const version = yield this.getPackageVersion();
            if (!version) {
                core_1.default.error('The package version could not be determined.');
                return;
            }
            const imageName = `${this.options.registryHost}/${this.options.registryProject}/${this.options.registryRepository}`;
            const imageNameVersion = (0, utils_1.buildImageURL)(imageName, version);
            yield (0, utils_1.buildDockerImage)({
                filePath: this.options.imageFile,
                tag: imageNameVersion,
                labels: {
                    runId: `${github_1.default.context.runId}`,
                    runNumber: `${github_1.default.context.runNumber}`,
                },
            });
            const image = yield (0, utils_1.useDocker)().getImage(imageNameVersion);
            if (this.options.imageTag) {
                if (this.options.imageTagExtra) {
                    yield (0, utils_1.pushImage)(image, this.authConfig);
                }
                const imageNameTag = (0, utils_1.buildImageURL)(imageName, this.options.imageTag);
                yield (0, utils_1.tagImage)({
                    sourceImage: image,
                    destinationTag: this.options.imageTag,
                    destinationImage: imageName,
                });
                yield (0, utils_1.pushImage)(imageNameTag, this.authConfig);
                yield (0, utils_1.removeImage)(imageNameTag);
            }
            else {
                yield (0, utils_1.pushImage)(image, this.authConfig);
            }
            yield (0, utils_1.removeImage)(image);
        });
    }
}
exports.Runner = Runner;
//# sourceMappingURL=module.js.map