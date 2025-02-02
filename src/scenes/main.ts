import colors from "../data/colors";
import levels from "../data/levels";
import strings from "../data/strings";
import { UiIconButton, UiRectButton  } from "../entities/ui";
import { Scene  } from "../shared/factories";
import { EventKey, SceneKey } from "../shared/keys";
import { randomInt } from "../shared/utils";
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
    private menuRectangle: Phaser.GameObjects.Rectangle;
    private restartButton: UiRectButton;
    private toTitleButton: UiRectButton;

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

        new UiIconButton(this, strings.chars.options)
            .setPosition(9, height - 8)
            .on('pointerup', this.onOptionsClick, this);

        new UiIconButton(this, strings.chars.fullscreen)
            .setPosition(width - 9, height - 8)
            .on('pointerup', this.onFullscreenClick, this);

        this.menuRectangle = this.add.rectangle(0, 0, 100, 80, colors.ui.mainBackground)
            .setScrollFactor(0)
            .setOrigin(0.5, 0.5)
            .setPosition(width / 2, height / 2 + 32);

        this.restartButton = new UiRectButton(this, strings.mainScene.restart)
            .setPosition(width / 2, height / 2 + 16)
            .setRectSize(60, 16)
            .setRectTint(colors.ui.mainForeground)
            .setOnClick(() => this.game.events.emit(EventKey.GameStarted));

        this.toTitleButton = new UiRectButton(this, strings.mainScene.toTitle)
            .setPosition(width / 2, height / 2 + 40)
            .setRectSize(60, 16)
            .setRectTint(colors.ui.mainForeground)
            .setOnClick(() => this.game.events.emit(EventKey.TitleStarted, { levelIdx: randomInt(0, levels.length)}));

        this.hideMenu();

        this.game.events.emit(EventKey.TitleStarted, { levelIdx: randomInt(0, levels.length)});
    }

    private nextScene<T extends object>(sceneKey: string, sceneParams?: T) {
        if (this.runningSceneKey)
            this.scene.stop(this.runningSceneKey);
        this.scene.launch(sceneKey, sceneParams);
        this.runningSceneKey = sceneKey;
        this.hideMenu();
    }

    private hideMenu() {
        this.menuRectangle.setVisible(false);
        this.restartButton.setVisible(false);
        this.toTitleButton.setVisible(false);
    }

    private showMenu() {
        this.menuRectangle.setVisible(true);
        this.restartButton.setVisible(true);
        this.toTitleButton.setVisible(true);
    }

    private pauseGame() {
        this.scene.pause(this.runningSceneKey);
    }

    private unpauseGame() {
        this.scene.resume(this.runningSceneKey);
    }

    private onOptionsClick() {
        if (this.scene.isPaused(this.runningSceneKey)) {
            this.unpauseGame();
            this.hideMenu();
        } else {
            this.pauseGame();
            this.showMenu();
        }
    }

    private onFullscreenClick() {
        this.scale.isFullscreen
            ? this.scale.stopFullscreen()
            : this.scale.startFullscreen();
        this.scale.lockOrientation(Phaser.Scale.LANDSCAPE);
    }

    private onTitleStarted(params?: Partial<TitleSceneParams>) {
        this.log("main", "title started");
        this.nextScene(SceneKey.Title, params);
    }

    private onGameStarted(params?: Partial<GameSceneParams>) {
        this.log("main", "game started");
        this.nextScene(SceneKey.Game, params);
    }

    private onOverStarted(params?: Partial<OverSceneParams>) {
        this.log("main", "over started");
        this.nextScene(SceneKey.Over, params);
    }

    private onTutorialStarted(params?: Partial<TutorialSceneParams>) {
        this.log("main", "tutorial started");
        this.nextScene(SceneKey.Tutorial, params);
    }

    private onDevmodeStarted(params?: Partial<DevmodeSceneParams>) {
        this.log("main", "devmode started");
        this.nextScene(SceneKey.Devmode, params);
    }
}
