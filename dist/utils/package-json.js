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
exports.readPackageJson = exports.getPackageJsonVersion = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const smob_1 = require("smob");
function getPackageJsonVersion(directoryPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const file = yield readPackageJson(directoryPath);
        if ((0, smob_1.isObject)(file) &&
            (0, smob_1.hasOwnProperty)(file, 'version') &&
            typeof file.version === 'string') {
            return file.version;
        }
        return undefined;
    });
}
exports.getPackageJsonVersion = getPackageJsonVersion;
function readPackageJson(directoryPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const filePath = path_1.default.join(directoryPath || process.cwd(), 'package.json');
        try {
            yield fs_1.default.promises.access(filePath, fs_1.default.constants.F_OK | fs_1.default.constants.R_OK);
        }
        catch (e) {
            return {};
        }
        const rawFile = yield fs_1.default.promises.readFile(filePath, { encoding: 'utf-8' });
        return JSON.parse(rawFile);
    });
}
exports.readPackageJson = readPackageJson;
//# sourceMappingURL=package-json.js.map