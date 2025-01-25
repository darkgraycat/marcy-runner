import { randomInt } from "./utils";

export function* blockHeightGenerator(
    widthsRange: [from: number, to: number],
    heightsRange: [from: number, to: number],
    decrement: number = 1,
    increment: number = 2,
): Generator<number> {
    const [minWidth, maxWidth] = widthsRange;
    const [minHeight, maxHeight] = heightsRange;

    let lastWidth = 0;
    let lastHeight = -1;

    while (true) {
        const limitWidth = randomInt(minWidth, maxWidth);

        lastWidth = lastWidth < limitWidth
            ? lastWidth + 1
            : 0;

        lastHeight = lastWidth > 0
            ? randomInt(
                Math.max(lastHeight - decrement, minHeight),
                Math.min(lastHeight + increment, maxHeight),
            )
            : -1;

        yield lastHeight;
    }
}

