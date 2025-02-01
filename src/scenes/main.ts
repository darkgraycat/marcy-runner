import strings from "../data/strings";
import { UiTextButton } from "../entities/ui";
import { Scene } from "../shared/factories";
import { EventKey, SceneKey } from "../shared/keys";
import { DevmodeSceneParams } from "./devmode";
import { GameSceneParams } from "./game";
import { OverSceneParams } from "./over";
import { TitleSceneParams } from "./title";
import { TutorialSceneParams } from "./tutorial";

const defaults = {
    initialSceneKey: SceneKey.Title,
};

export type MainSceneParams = typeof defaults;

export class MainScene extends Scene<MainSceneParams>(SceneKey.Main, defaults) {
    private runningSceneKey: string;

    create() {
        super.create();
        this.scene.bringToTop();

        this.game.events.on(Phaser.Core.Events.BLUR, this.pauseGame, this);
        this.game.events.on(Phaser.Core.Events.FOCUS, this.unpauseGame, this);

        this.game.events.on(EventKey.TitleStarted, this.onTitleStarted, this);
        this.game.events.on(EventKey.GameStarted, this.onGameStarted, this);
        this.game.events.on(EventKey.OverStarted, this.onOverStarted, this);
        this.game.events.on(EventKey.TutorialStarted, this.onTutorialStarted, this);
        this.game.events.on(EventKey.DevmodeStarted, this.onDevmodeStarted, this);

        const { width, height } = this.scale;

        new UiTextButton(this, strings.chars.cat)
            .setOrigin(0.5, 0.5)
            .setPosition(9, height - 8)
            .setRectAlpha(0.1)
            .setOnClick(() => this.handleOnClickOptions());

        this.game.events.emit(EventKey.TitleStarted, {});
    }

    private pauseGame() {
        this.scene.pause(this.runningSceneKey);
    }

    private unpauseGame() {
        this.scene.resume(this.runningSceneKey);
    }

    private nextScene<T extends object>(sceneKey: string, sceneParams?: T) {
        if (this.runningSceneKey)
            this.scene.stop(this.runningSceneKey);
        this.scene.launch(sceneKey, sceneParams);
        this.runningSceneKey = sceneKey;
    }

    private handleOnClickOptions() {
        this.scene.isPaused(this.runningSceneKey)
            ? this.unpauseGame()
            : this.pauseGame();
    }

    private onTitleStarted(params: TitleSceneParams) {
        this.log("main", "title started");
        this.nextScene(SceneKey.Title, params);
    }

    private onGameStarted(params: GameSceneParams) {
        this.log("main", "game started");
        this.nextScene(SceneKey.Game, params);
    }

    private onOverStarted(params: OverSceneParams) {
        this.log("main", "over started");
        this.nextScene(SceneKey.Over, params);
    }

    private onTutorialStarted(params: TutorialSceneParams) {
        this.log("main", "tutorial started");
        this.nextScene(SceneKey.Tutorial, params);
    }

    private onDevmodeStarted(params: DevmodeSceneParams) {
        this.log("main", "devmode started");
        this.nextScene(SceneKey.Devmode, params);
    }
}
