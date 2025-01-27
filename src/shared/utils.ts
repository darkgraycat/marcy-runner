export function random(lo: number, hi: number) {
    return Math.random() * (hi - lo) + lo;
}

export function randomInt(lo: number, hi: number) {
    return Math.floor(Math.random() * (hi - lo) + lo);
}

export function randomBool(chance: number) {
    return Math.random() < chance;
}

export function randomElement<T>(array: T[]): T {
    return array[randomInt(0, array.length)]
}

export function randomByProbability(probabilityMap: Record<string, number>): string {
    const totalProbability = Object
        .values(probabilityMap)
        .reduce((acc, v) => acc += v, 0);

    const rand = random(0, totalProbability);
    let cumulativeProbability = 0;

    return Object.entries(probabilityMap).find(([key, probability]) => {
        cumulativeProbability += probability;
        return rand < cumulativeProbability;
    })[0];
}

export function iterate<T>(times: number, handler: (idx: number) => T): T[] {
    const result = new Array(times);
    for (let i = 0; i < times; i++) result[i] = handler(i);
    return result;
}

export function lerp(from: number, to: number, step: number): number {
    return from + (to - from) * step;
}

export function chunks<T>(array: T[], size: number): T[][] {
    let idx = 0;
    const chunks: T[][] = [];
    while (array.length > idx) chunks
        .push(array.slice(idx, idx += size));
    return chunks;
}

export function snap(n: number, size: number) {
    return ((n / size) | 0) * size;
}

export function chain(...args: ((payload: any, cb: () => void) => any)[]) {

}

export function colorToRgb(hex: number) {
    return [
        (hex >> 16) & 0xff,
        (hex >> 8) & 0xff,
        (hex >> 0) & 0xff,
    ]
}

export function colorToHex([r, g, b]: number[]) {
    return (r << 16) | (g << 8) | b;
}

export function formatString(str: string, ...args: (string | number)[]) {
    let index = 0;
    return str.replace(/%s/g, (match) => `${args[index++]}` ?? match);
}
