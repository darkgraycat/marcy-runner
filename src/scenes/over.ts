import { EventKey, SceneKey } from "../shared/keys";
import { GroupEntity, Scene } from "../shared/factories";
import { Background } from "../entities/background";
import { DEBUG } from "../shared/settings";
import levels, { LevelsDataBgIdxs } from "../data/levels";
import { UiRectButton, UiText } from "../entities/ui";
import strings from "../data/strings";
import { randomInt } from "../shared/utils";

class BackgroundsGroup extends GroupEntity({
    class: Background,
    capacity: 10,
}) {}

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
    private backgrounds: BackgroundsGroup;

    create() {
        super.create();

        if (DEBUG.skipTitle) this.restartGame();

        this.cameras.main.fadeFrom(3000, 0, 0, 0);

        /* #backgrounds */
        const level = levels[this.params.levelIdx];
        this.cameras.main.setBackgroundColor(level.sky);

        this.backgrounds = new BackgroundsGroup(this).fillBy(
            level.backgrounds,
            (_, [frame, y, color, scrollScale]) => new Background(this, frame, y, scrollScale).setTint(color),
        )

        /* #ui */
        const { width, height } = this.scale;
        new UiText(this, strings.overScene.results)
            .setTextArgs(this.params.points, this.params.targetPoints, this.params.maxSpeedMod, this.params.distance)
            .setPosition(width / 2, 32);

        new UiRectButton(this, strings.overScene.restart)
            .setPosition(width / 2, height - 40)
            .setRectSize(60, 16)
            .setRectTint(level.backgrounds[1][LevelsDataBgIdxs.COLOR])
            .setOnClick(() => this.restartGame());

        new UiRectButton(this, strings.overScene.toTitle)
            .setPosition(width / 2, height - 16)
            .setRectSize(60, 16)
            .setRectTint(level.backgrounds[1][LevelsDataBgIdxs.COLOR])
            .setOnClick(() => this.goToTitle());
    }

    update(time: number, delta: number): void {
        this.backgrounds.getEntities().forEach((bg, index) => {
            bg.tilePositionX += levels[this.params.levelIdx].backgrounds[index][LevelsDataBgIdxs.SCROLL_SCALE];
        });
    }

    private restartGame() {
        this.game.events.emit(EventKey.LevelStarted, { levelIdx: randomInt(0, levels.length) });
    }

    private goToTitle() {
        this.game.events.emit(EventKey.TitleStarted, { levelIdx: randomInt(0, levels.length)});
    }
}
