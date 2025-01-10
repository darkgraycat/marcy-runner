export const GAMEPLAY = {
    maximumPoints: 100,
    maximumLifes: 3,
    initialSpeed: 100,
    initialHeight: 220,
    // TODO: speed bonus values should be handled in corresponding Collectable
    speedBonusMax: 100,
    speedBonusStep: 20,
    speedBonusTick: 0.15,
}

export const SETTINGS = {
    volumeMute: false,
    volumeMusic: 0.5,
    volumeEffects: 0.3,
}

export const SPAWN_RATES = {
    COLLECTABLES: {
        panacat: 0.6,
        bean: 0.2,
        // star: 0.1,
    },
}

export const DEBUG = {
    fastRestart: false,
    debugPhysics: false,
}
