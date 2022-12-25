"use strict";
/*
 * Copyright (c) 2022-2022.
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeImage = void 0;
const instance_1 = require("../instance");
function removeImage(image) {
    return __awaiter(this, void 0, void 0, function* () {
        if (typeof image === 'string') {
            image = (0, instance_1.useDocker)().getImage(image);
        }
        yield image
            .remove({
            force: true,
        });
    });
}
exports.removeImage = removeImage;
//# sourceMappingURL=image-remove.js.map