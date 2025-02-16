import colors from "../data/colors";
import levels, { LevelsDataBgIdxs } from "../data/levels";
import strings from "../data/strings";
import { Background } from "../entities/background";
import { UiText, UiRectButton } from "../entities/ui";
import { VERSION } from "../shared/constants";
import { Scene } from "../shared/factories";
import { EventKey, SceneKey } from "../shared/keys";
import { DEBUG, GAMEPLAY } from "../shared/settings";
import { randomInt } from "../shared/utils";
import { DevmodeSceneParams } from "./devmode";
import { LevelSceneParams } from "./level";

const defaults = {
    levelIdx: 0,
};

export type TitleSceneParams = typeof defaults;

export class TitleScene extends Scene<TitleSceneParams>(SceneKey.Title, defaults) {
    private backgrounds: Phaser.GameObjects.Group;

    create() {
        this.log("create", "start");

        super.create();

        if (DEBUG.skipTitle) this.startGame();

        this.cameras.main.fadeFrom(2000, 0, 0, 0);

        /* #backgrounds */
        const level = levels[this.params.levelIdx];
        this.cameras.main.setBackgroundColor(level.sky);
        this.backgrounds = this.add.group({ runChildUpdate: false });
        for (const [frame, y, color, scrollScale] of level.backgrounds) {
            this.backgrounds.add(new Background(this, frame, y, scrollScale).setTint(color))
        }

        /* #ui */
        const { width, height } = this.scale;
        new UiText(this, VERSION)
            .setOrigin(0, 0)
            .setTint(colors.ui.debug)
            .setPosition(0, 0);
            

        new UiText(this, strings.titleScene.title)
            .setPosition(width / 2, 32)
            .setScale(2);

        new UiText(this, strings.titleScene.objectives)
            .setTextArgs(GAMEPLAY.targetPoints)
            .setTint(level.sky)
            .setPosition(width / 2, height - 16);

        new UiRectButton(this, strings.titleScene.buttonStart)
            .setPosition(width / 2, height - 64)
            .setRectSize(100, 16)
            .setRectTint(level.backgrounds[1][LevelsDataBgIdxs.COLOR])
            .setOnClick(() => this.startGame());

        new UiRectButton(this, strings.titleScene.buttonTutorial)
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

        this.log("create", "end");
    }

    update() {
        this.backgrounds.getChildren().forEach((c, index) => {
            const bg = c as Background;
            bg.tilePositionX += levels[this.params.levelIdx].backgrounds[index][LevelsDataBgIdxs.SCROLL_SCALE];
        });
    }

    private startGame() {
        this.log("startGame", "clicked");
        this.game.events.emit(EventKey.LevelStarted, { levelIdx: this.params.levelIdx });
    }

    private startTutorial() {
        this.game.events.emit(EventKey.TutorialStarted);
    }

    private startGameWithOverrides(params?: Partial<LevelSceneParams>) {
        this.game.events.emit(EventKey.LevelStarted, params);
    }

    private startDevmode(params?: Partial<DevmodeSceneParams>) {
        this.game.events.emit(EventKey.DevmodeStarted, params);
    }
}
