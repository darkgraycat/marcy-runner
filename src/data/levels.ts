export const LevelsDataBgIdxs = {
    FRAME: 0,
    Y: 1,
    COLOR: 2,
    SCROLL_SCALE: 3,
};

export type LevelsData = {
    sky: number,
    buildings: number,
    backgrounds: [
        frame: number,
        y: number,
        color: number,
        scrollScale: number,
    ][],
};

export default [
    { // 0
        sky: 0xcf573c,
        buildings: 0xcf573c,
        backgrounds: [
            [1, 1.0, 0xa53030, .05],
            [1, 1.3, 0x752438, .1],
            [2, 1.6, 0x402751, .2],
            [7, 1.8, 0x1e1d39, .3],
            [7, 2.0, 0x241527, .4]
        ],
    },
    { // 1
        sky: 0x20a7f3,
        buildings: 0xf0b090,
        backgrounds: [
            [3, 1.3, 0x2b93ab, .05],
            [3, 1.4, 0x277a6b, .10],
            [6, 1.6, 0x235736, .30],
            [9, 1.9, 0x273b1c, .40],
            [0, 2.5, 0x2785b9, .50]
        ],
    },
    { // 2
        sky: 0xf08050,
        buildings: 0xf08050,
        backgrounds: [
            [3, 1.2, 0xc45821, .10],
            [5, 1.4, 0x823f16, .20],
            [3, 1.6, 0x59341d, .30],
            [7, 1.6, 0x2f301f, .40],
            [7, 1.8, 0x27291d, .45],
            [7, 2.0, 0x222419, .50]
        ],
    },
    { // 3
        sky: 0xe48485,
        buildings: 0x8a7897,
        backgrounds: [
            [3, 1.2, 0xc2747d, 0.05],
            [5, 1.3, 0x8f6072, 0.1],
            [3, 1.6, 0x654e5c, 0.2],
            [5, 1.9, 0x453a4c, 0.3],
            [8, 2.2, 0x363040, 0.4],
        ],
    },
    { // 4
        sky: 0xffbda3,
        buildings: 0x816f9b,
        backgrounds: [
            [2, 1.1, 0xec8c9d, 0.05],
            [7, 1.2, 0xcc6a8d, 0.1],
            [6, 1.6, 0x8f496a, 0.2],
            [9, 2.1, 0x4f445d, 0.3],
            [8, 2.2, 0x9292f, 0.4],
        ],
    },
    { // 5
        sky: 0x9dc1d0,
        buildings: 0xda8678,
        backgrounds: [
            [1, 1.2, 0x81b0c0, 0.05],
            [3, 1.5, 0x5a869b, 0.1],
            [3, 1.7, 0x4c697f, 0.2],
            [3, 1.9, 0x2f3e4d, 0.3],
            [3, 2, 0x202d3b, 0.4],
        ],
    },
    { // 6
        sky: 0x123a78,
        buildings: 0x2e242e,
        backgrounds: [
            [1, 1.1, 0x513b72, 0.05],
            [3, 1.3, 0x763b6f, 0.1],
            [3, 1.5, 0xa1456a, 0.2],
            [5, 1.6, 0x2e242e, 0.3],
            [5, 1.9, 0x1e1a1e, 0.4],
        ],
    },
    { // 7
        sky: 0xfec699,
        buildings: 0xd09a95,
        backgrounds: [
            [7, 1.2, 0xfeae84, 0.05],
            [2, 1.5, 0xfda281, 0.1],
            [7, 1.6, 0xf18b80, 0.2],
            [2, 2.1, 0xce7d84, 0.3],
            [7, 2.2, 0xa7707c, 0.4],
        ],
    },
] as LevelsData[];
