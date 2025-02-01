import { SceneKey } from "../shared/keys";
import { Scene } from "../shared/factories";
import { Background } from "../entities/background";
import { DEBUG } from "../shared/settings";
import levels, { LevelsDataBgIdxs } from "../data/levels";
import { UiText } from "../entities/ui";
import strings from "../data/strings";

const defaults = {
    message: "",
    finished: false,
    points: 0,
    distance: 0,
    maxSpeedMod: 0,
    levelIdx: 0,
};

export type OverSceneParams = typeof defaults;

export class OverScene extends Scene(SceneKey.Over, {
    message: "",
    finished: false,
    points: 0,
    distance: 0,
    maxSpeedMod: 0,
    levelIdx: 0,
} as OverSceneParams) {
    backgrounds: Phaser.GameObjects.Group;

    create() {
        super.create();

        if (DEBUG.fastRestart) return this.restartGame();

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
            .setTextArgs(this.params.points, this.params.maxSpeedMod, this.params.distance)
            .setPosition(width / 2, 32);

        // TODO: replace
        setTimeout(() => {
            this.input.keyboard.on('keydown', () => this.restartGame());
            this.input.on('pointerdown', () => this.restartGame());
        }, 2000);
    }

    update(time: number, delta: number): void {
        this.backgrounds.getChildren().forEach((c, index) => {
            const bg = c as Background;
            bg.tilePositionX += levels[this.params.levelIdx].backgrounds[index][LevelsDataBgIdxs.SCROLL_SCALE];
        });
    }

    private restartGame() {
        this.scene.start(SceneKey.Game);
    }
}
