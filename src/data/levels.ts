export type LevelsData = {
    sky: number,
    backgrounds: [
        frame: number,
        y: number,
        color: number,
        scrollScale: number,
        autoScroll?: boolean
    ][]
    buildings: number,
};

export default [
    {
        sky: 0xcf573c,
        backgrounds: [
            [1, 32, 0xa53030, 0.05],
            [1, 40, 0x752438, 0.10],
            [2, 50, 0x402751, 0.20],
            [7, 59, 0x1e1d39, 0.35],
            [7, 64, 0x241527, 0.45]
        ],
        buildings: 0xcf573c
    },
    {
        sky: 0x20a7f3,
        backgrounds: [
            [2, 32, 0x2b93ab, 0.1],
            [3, 44, 0x277a6b, 0.2],
            [6, 50, 0x235736, 0.3],
            [9, 59, 0x273b1c, 0.4],
            [0, 80, 0x2785b9, 0.5]
        ],
        buildings: 0xf0b090
    },
    {
        sky: 0xf08050,
        backgrounds: [
            [4, 8, 0xaf4e3d, 0.2, true],
            [4, 0, 0x953c37, 0.1, true],
            [7, 40, 0x803010, 0.1],
            [3, 60, 0x403030, 0.2],
            [5, 65, 0x504040, 0.3],
            [3, 70, 0x605050, 0.4],
            [5, 75, 0x706060, 0.5]
        ],
        buildings: 0xf0b090
    },
    {
        sky: 0xf08050,
        backgrounds: [
            [7, 32, 0x803010, 0.1],
            [7, 44, 0x403030, 0.2],
            [3, 50, 0x504040, 0.3],
            [3, 59, 0x605050, 0.4],
            [5, 64, 0x706060, 0.5]
        ],
        buildings: 0xf0b090
    }
] as LevelsData[];
