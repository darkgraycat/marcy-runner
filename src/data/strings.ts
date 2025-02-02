const chars = {
    life: ':',
    cat: '§',
    caffeine: '`',
    panacat: ':',

    options: '0',
    fullscreen: 'x',
};

export default {
    chars,

    bootScene: {
        welcome: "Привіт %s!",
        title: `${chars.cat} Котик біжить! ${chars.cat}`,
        objectives: `Збери %s панакотиків\n${chars.panacat} Та отримай приз!  ${chars.panacat}`,
        buttonStart: "Почати забіг",
        buttonTutorial: "Як грати?",
        hints: [
            `Панакотик ${chars.panacat}\nЗбери %s для перемоги`,
            `Кавове зерно ${chars.caffeine}\nПрискорює, але будь обережний`,
            `Життя ${chars.life}\nДає додаткове життя`,
        ],
    },

    gameScene: {
        panacatsCollected: `${chars.panacat}%s${chars.panacat}`,
        lifesLeft: `${chars.cat} %s`,
        caffeine: "%s",
    },

    overScene: {
        results: `Зібрано %s з %s${chars.panacat}\nМаксимальна швидкість%s${chars.caffeine}\nВідстань %s${chars.cat}`,
        restart: `Бігти знов`,
        toTitle: `На головну`,
    },

    tutorialScene: {
        intro: "Цей функціонал на стадії розробки.\nВідповідальна особа-\nГоловний Інженер Степан Срака"
    },

    levelNames: [
        "" // TODO: idea to make it like in Sonic
    ],
}
