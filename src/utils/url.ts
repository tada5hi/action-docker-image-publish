export function cleanDoubleSlashes(input: string) : string {
    if (input.indexOf('://') !== -1) {
        return input.split('://')
            .map((str) => cleanDoubleSlashes(str))
            .join('://');
    }

    return input.replace(/\/+/g, '/');
}
