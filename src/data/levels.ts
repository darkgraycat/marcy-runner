export type LevelsData = {
    sky: number,
    backgrounds: [
        frame: number,
        y: number,
        color: number,
        scrollScale: number,
    ][]
    buildings: number,
};

export default [
    { // 0
        sky: 0xcf573c,
        backgrounds: [
            [1, 1.0, 0xa53030, .05],
            [1, 1.3, 0x752438, .1],
            [2, 1.6, 0x402751, .2],
            [7, 1.8, 0x1e1d39, .3],
            [7, 2.0, 0x241527, .4]
        ],
        buildings: 0xcf573c
    },
    { // 1
        sky: 0x20a7f3,
        backgrounds: [
            [3, 1.3, 0x2b93ab, .05],
            [3, 1.4, 0x277a6b, .10],
            [6, 1.6, 0x235736, .30],
            [9, 1.9, 0x273b1c, .40],
            [0, 2.5, 0x2785b9, .50]
        ],
        buildings: 0xf0b090
    },
    { // 2
        sky: 0xf08050,
        backgrounds: [
            [7, 1.2, 0x803010, .10],
            [3, 1.8, 0x403030, .20],
            [5, 2.0, 0x504040, .30],
            [3, 2.2, 0x605050, .40],
            [5, 2.4, 0x706060, .50]
        ],
        buildings: 0xf0b090
    },
    { // 3
        sky: 0xf08050,
        backgrounds: [
            [7, 1.0, 0x803010, .10],
            [7, 1.4, 0x403030, .20],
            [3, 1.6, 0x504040, .30],
            [3, 1.8, 0x605050, .40],
            [5, 2.0, 0x706060, .50]
        ],
        buildings: 0xf0b090
    }
] as LevelsData[];
