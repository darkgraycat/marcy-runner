import levels, { LevelsDataBgIdxs } from "../data/levels";
import strings from "../data/strings";
import { Background } from "../entities/background";
import { UiText, UiRectButton } from "../entities/ui";
import { Scene } from "../shared/factories";
import { EventKey, SceneKey } from "../shared/keys";
import { DEBUG, GAMEPLAY } from "../shared/settings";
import { randomInt } from "../shared/utils";
import { DevmodeSceneParams } from "./devmode";
import { GameSceneParams } from "./game";

const defaults = {};

export type TitleSceneParams = typeof defaults;

export class TitleScene extends Scene<TitleSceneParams>(SceneKey.Title, defaults) {
    private levelIdx: number;
    private backgrounds: Phaser.GameObjects.Group;

    create() {
        super.create();

        if (DEBUG.fastRestart) return;

        /* #backgrounds */
        this.levelIdx = randomInt(0, levels.length)
        const level = levels[this.levelIdx];
        this.cameras.main.setBackgroundColor(level.sky);
        this.backgrounds = this.add.group({ runChildUpdate: false });
        for (const [frame, y, color, scrollScale] of level.backgrounds) {
            this.backgrounds.add(new Background(this, frame, y, scrollScale).setTint(color))
        }

        /* #ui */
        const { width, height } = this.scale;
        new UiText(this, strings.bootScene.title)
            .setPosition(width / 2, 32)
            .setScale(2);

        new UiText(this, strings.bootScene.objectives)
            .setTextArgs(GAMEPLAY.targetPoints)
            .setTint(level.sky)
            .setPosition(width / 2, height - 16);

        new UiRectButton(this, strings.bootScene.buttonStart)
            .setPosition(width / 2, height - 64)
            .setRectSize(100, 16)
            .setRectTint(level.backgrounds[1][LevelsDataBgIdxs.COLOR])
            .setOnClick(() => this.startGame());

        new UiRectButton(this, strings.bootScene.buttonTutorial)
            .setPosition(width / 2, height - 40)
            .setRectSize(100, 16)
            .setRectTint(level.backgrounds[1][LevelsDataBgIdxs.COLOR])
            .setOnClick(() => this.startTutorial());

        /* cheats */
        let combination = '';
        this.input.keyboard.on('keydown', ({ key }) => {
            combination += key;
            if (key == ' ') combination = '';
            if (combination.endsWith('level')) return this.startGameWithOverrides({ levelIdx: +combination.split('level')[0] })
            if (combination.endsWith('devmode')) return this.startDevmode({ levelIdx: +combination.split('devmode')[0] });
            if (combination == 'cocaine') return this.startGameWithOverrides({ speedBonus: 100, speedBonusMax: 500, jumpVelocity: 250 });
        });
    }

    update() {
        this.backgrounds.getChildren().forEach((c, index) => {
            const bg = c as Background;
            bg.tilePositionX += levels[this.levelIdx].backgrounds[index][LevelsDataBgIdxs.SCROLL_SCALE];
        });
    }

    private startGame() {
        this.game.events.emit(EventKey.GameStarted, { levelIdx: randomInt(0, levels.length) });
    }

    private startTutorial() {
        this.game.events.emit(EventKey.TutorialStarted);
    }

    private startGameWithOverrides(params?: Partial<GameSceneParams>) {
        this.game.events.emit(EventKey.GameStarted, params);
    }

    private startDevmode(params?: Partial<DevmodeSceneParams>) {
        this.game.events.emit(EventKey.DevmodeStarted, params);
    }
}
