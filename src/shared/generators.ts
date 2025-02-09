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

        if (lastWidth <= limitWidth) {
            lastWidth++;
            lastHeight = randomInt(
                Math.max(lastHeight - decrement, minHeight),
                Math.min(lastHeight + increment, maxHeight),
            );
        } else {
            lastWidth = 0;
            lastHeight = -1;
        }

        yield lastHeight;
    }
}

