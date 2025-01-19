export const GAMEPLAY = {
    targetPoints: 333,
    initialLifes: 3,
    initialSpeed: 100,
    initialHeight: 200,
    speedBonusMax: 100,
    speedBonusStep: 13,
    speedBonusTick: 0.06,
}

export const SETTINGS = {
    volumeMute: false,
    volumeMusic: 0.5,
    // volumeEffects: 0.3,
    volumeEffects: 0.0,
    // userName: "Марсічка",
    userName: "Кицюня Кицик Котічка Кошеня Кицюрівна Кицька Киця".split(' ')[Math.random() * 6 | 0]
}

export const SPAWN_RATES = {
    COLLECTABLES: {
        panacat: 0.9,
        bean: 0.5,
        life: 0.05,
    },
}

export const DEBUG = {
    fastRestart: true,
    fastRespawn: false,
    debugPhysics: false,
}
