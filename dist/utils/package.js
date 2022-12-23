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
exports.hasPackageChanged = void 0;
const github_1 = __importDefault(require("@actions/github"));
const smob_1 = require("smob");
const contants_1 = require("../contants");
const url_1 = require("./url");
function hasPackageChanged(client, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const packagePath = (0, url_1.withoutLeadingSlash)(options.packagePath);
        const url = new URL(`/repos/${github_1.default.context.repo.owner}/${github_1.default.context.repo.repo}/commits`);
        if (packagePath !== contants_1.PACKAGE_PATH_DEFAULT) {
            url.searchParams.set('path', packagePath);
        }
        if (options.registryHost === contants_1.REGISTRY_GITHUB) {
            const { data } = yield client.rest.packages.getPackageForUser({
                package_type: 'container',
                package_name: options.registryRepository,
                username: github_1.default.context.repo.owner,
            });
            url.searchParams.set('since', data.created_at);
            url.searchParams.set('per_page', '1');
        }
        const { data: commits } = yield client.request(url.href);
        if (Array.isArray(commits)) {
            if (commits.length === 0) {
                return false;
            }
            // check if commit is most recent...
            const commit = commits.shift();
            return (0, smob_1.isObject)(commit) && commit.sha === github_1.default.context.sha;
            // todo: check if match ignore option
        }
        return false;
    });
}
exports.hasPackageChanged = hasPackageChanged;
//# sourceMappingURL=package.js.map