// ; - life
// § - cat
// ` - caffeine
// : - panacat
//

const chars = {
    life: ':',
    cat: '§',
    caffeine: '`',
    panacat: ':',
};

export default {
    chars,

    bootScene: {
        title: "Привіт %s!",
        objectives: `Збери %s панакотиків\n${chars.cat} Та отримай приз!  ${chars.cat}`,
        buttonStart: "Почати забіг",
        buttonTutorial: "Як грати?",
        hints: "",
    },
    gameScene: {
        panacatsCollected: `${chars.panacat}%s${chars.panacat}`,
        lifesLeft: `${chars.cat} %s`,
        caffeine: "%s",
    },
    overScene: {
        results: `Зібрано %s${chars.panacat}\nМаксимальна швидкість%s${chars.caffeine}\nВідстань %s${chars.cat}`,
    },
    tutorialScene: {
        intro: "Цей функціонал на стадії розробки.\nВідповідальна особа-\nГоловний Інженер Степан Срака"
    },
}
