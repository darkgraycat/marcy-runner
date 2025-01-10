export type RoundMethod = 'floor' | 'round' | 'ceil';

export function random(lo: number, hi: number) {
    return Math.random() * (hi - lo) + lo;
}

export function randomInt(lo: number, hi: number) {
    return Math.floor(Math.random() * (hi - lo) + lo);
}

export function randomElement<T>(array: T[]): T {
    return array[randomInt(0, array.length)]
}

export function iterate<T>(times: number, handler: (idx: number) => T): T[] {
    const result = new Array(times);
    for (let i = 0; i < times; i++) result[i] = handler(i);
    return result;
}

export function chunks<T>(array: T[], size: number): T[][] {
    let idx = 0;
    const chunks: T[][] = [];
    while (array.length > idx) chunks
        .push(array.slice(idx, idx += size));
    return chunks;
}

export function snapToTile(x: number, tilesize: number, method: RoundMethod = 'floor') {
    return Math[method](x / tilesize) * tilesize;
}
