import { randomInt } from "./utils";

export function* blockHeightGenerator(config: {
    widthsRange: [from: number, to: number],
    heightsRange: [from: number, to: number],
    decrement: number,
    increment: number,
}): Generator<number, number, number> {
    const [minWidth, maxWidth] = config.widthsRange;
    const [minHeight, maxHeight] = config.heightsRange;
    const { decrement, increment } = config;

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

