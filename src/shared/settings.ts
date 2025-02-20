export const GAMEPLAY = {
    targetPoints: 200,
    initialLifes: 3,
    initialMoveVelocity: 100,
    initialJumpVelocity: 200,
    speedBonus: 25,
    speedBonusMax: 100,
    speedBonusTick: 0.03,
    enemyDroneVelocity: 50,
    enemyDroneAmount: 3,
    collectableAmount: 20,
    gravity: 500,
}

export const SETTINGS = {
    volumeMute: false,
    volumeMusic: 0.5,
    volumeEffects: 0.2,
    // volumeEffects: 0.0,
    // userName: "Марсічка",
    userName: "Кицюня Кицик Котічка Кошеня Кицюрівна Кицька Киця".split(' ')[Math.random() * 6 | 0]
}

export const SPAWN_RATES = {
    COLLECTABLES: {
        panacat: 0.9,
        bean: 0.4,
        life: 0.05,
    },
}

export const DEBUG = {
    skipTitle: false,
    fastRespawn: false,
    debugPhysics: false,
    useDebugLogs: false,
}
