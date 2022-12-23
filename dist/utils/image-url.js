/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */
export function buildImageURL(context, tag) {
    let base;
    if (typeof context === 'string') {
        base = context;
    }
    else {
        base = `${context.host}/${context.owner}/${context.name}`;
        tag = context.tag;
    }
    const name = base.split('/').pop();
    if (name.indexOf(':') !== -1 || name.indexOf('@') !== -1) {
        return name;
    }
    if (tag) {
        return base + (tag.startsWith('sha') ?
            `@${tag}` :
            `:${tag}`);
    }
    return name;
}
//# sourceMappingURL=image-url.js.map