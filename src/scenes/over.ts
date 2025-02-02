import { EventKey, SceneKey } from "../shared/keys";
import { Scene } from "../shared/factories";
import { Background } from "../entities/background";
import { DEBUG } from "../shared/settings";
import levels, { LevelsDataBgIdxs } from "../data/levels";
import { UiRectButton, UiText } from "../entities/ui";
import strings from "../data/strings";
import { randomInt } from "../shared/utils";

const defaults = {
    finished: false,
    points: 0,
    targetPoints: 0,
    distance: 0,
    maxSpeedMod: 0,
    levelIdx: 0,
};

export type OverSceneParams = typeof defaults;

export class OverScene extends Scene<OverSceneParams>(SceneKey.Over, defaults) {
    backgrounds: Phaser.GameObjects.Group;

    create() {
        super.create();

        if (DEBUG.fastRestart) return this.onRestartGame();

        /* #backgrounds */
        const level = levels[this.params.levelIdx];
        this.cameras.main.setBackgroundColor(level.sky);
        this.backgrounds = this.add.group({ runChildUpdate: false });
        for (const [frame, y, color, scrollScale] of level.backgrounds) {
            this.backgrounds.add(new Background(this, frame, y, scrollScale).setTint(color))
        }

        /* #ui */
        const { width, height } = this.scale;
        new UiText(this, strings.overScene.results)
            .setTextArgs(this.params.points, this.params.targetPoints, this.params.maxSpeedMod, this.params.distance)
            .setPosition(width / 2, 32);

        new UiRectButton(this, strings.overScene.restart)
            .setPosition(width / 2, height - 40)
            .setRectSize(60, 16)
            .setRectTint(level.backgrounds[1][LevelsDataBgIdxs.COLOR])
            .setOnClick(() => this.onRestartGame());

        new UiRectButton(this, strings.overScene.toTitle)
            .setPosition(width / 2, height - 16)
            .setRectSize(60, 16)
            .setRectTint(level.backgrounds[1][LevelsDataBgIdxs.COLOR])
            .setOnClick(() => this.onGoTitle());
    }

    update(time: number, delta: number): void {
        this.backgrounds.getChildren().forEach((c, index) => {
            const bg = c as Background;
            bg.tilePositionX += levels[this.params.levelIdx].backgrounds[index][LevelsDataBgIdxs.SCROLL_SCALE];
        });
    }

    private onRestartGame() {
        this.game.events.emit(EventKey.GameStarted, { levelIdx: randomInt(0, levels.length) });
    }

    private onGoTitle() {
        this.game.events.emit(EventKey.TitleStarted);
    }
}
