import colors from "../data/colors";
import levels from "../data/levels";
import strings from "../data/strings";
import { UiIconButton, UiRectButton, UiText  } from "../entities/ui";
import { Scene  } from "../shared/factories";
import { EventKey, SceneKey } from "../shared/keys";
import { randomInt } from "../shared/utils";
import { DevmodeSceneParams } from "./devmode";
import { LevelSceneParams } from "./level";
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
    private optionsButton: UiIconButton;
    private fullscreenButton: UiIconButton;

    // TODO: cleanup
    // private textDebug: UiText;

    create() {
        super.create();
        this.scene.bringToTop();

        this.game.events.on(Phaser.Core.Events.BLUR, this.pauseGame, this);
        this.game.events.on(Phaser.Core.Events.FOCUS, this.unpauseGame, this);

        this.game.events.on(EventKey.TitleStarted, this.onTitleStarted, this);
        this.game.events.on(EventKey.LevelStarted, this.onLevelStarted, this);
        this.game.events.on(EventKey.OverStarted, this.onOverStarted, this);
        this.game.events.on(EventKey.TutorialStarted, this.onTutorialStarted, this);
        this.game.events.on(EventKey.DevmodeStarted, this.onDevmodeStarted, this);

        this.scale.on('resize', this.onResize, this);

        const { width, height } = this.scale;

        this.optionsButton = new UiIconButton(this, strings.chars.options)
            .setRelativePosition(0.0, 1.0, 8, -8)
            .on('pointerup', this.onOptionsClick, this);

        this.fullscreenButton = new UiIconButton(this, strings.chars.fullscreen)
            .setRelativePosition(1.0, 1.0, -8, -8)
            .on('pointerup', this.onFullscreenClick, this);


        this.menuRectangle = this.add.rectangle(0, 0, 100, 80, colors.ui.mainBackground)
            .setScrollFactor(0)
            .setOrigin(0.5, 0.5)
            .setPosition(width / 2, height / 2 + 32);

        this.restartButton = new UiRectButton(this, strings.mainScene.restart)
            .setPosition(width / 2, height / 2 + 16)
            .setRectSize(60, 16)
            .setRectTint(colors.ui.mainForeground)
            .setOnClick(() => this.game.events.emit(EventKey.LevelStarted));

        this.toTitleButton = new UiRectButton(this, strings.mainScene.toTitle)
            .setPosition(width / 2, height / 2 + 40)
            .setRectSize(60, 16)
            .setRectTint(colors.ui.mainForeground)
            .setOnClick(() => this.game.events.emit(EventKey.TitleStarted, { levelIdx: randomInt(0, levels.length)}));

        this.hideMenu();

        this.game.events.emit(EventKey.TitleStarted, { levelIdx: randomInt(0, levels.length)});

        // DEBUG
        // this.textDebug = new UiText(this)
        //     .setPosition(width / 2, height / 2)
        //     .setScrollFactor(0)
        //     .setTint(0xff0000)
        //     .setText("DEBUG");

        // this.input.on('pointerup', (e) => {
        //     console.log(e.x, e.y);
        // }, this);
    }

    // update() {
    //     const { width, height, baseSize, gameSize, parentSize, displaySize } = this.scale;
    //     const mainCamera = this.cameras.main.worldView;
    //     const text = ''
    //         + `\nbaseSize ${baseSize.width} ${baseSize.height}`
    //         + `\ngameSize ${gameSize.width} ${gameSize.height}`
    //         + `\nparentSize ${parentSize.width} ${parentSize.height}`
    //         + `\ndisplaySize ${displaySize.width} ${displaySize.height}`
    //         + `\nmainCamera ${mainCamera.width} ${mainCamera.height}`

    //     this.textDebug.setText(text);
    //     
    // }

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
    }

    private onTitleStarted(params?: Partial<TitleSceneParams>) {
        this.log("main", "title started");
        this.nextScene(SceneKey.Title, params);
    }

    private onLevelStarted(params?: Partial<LevelSceneParams>) {
        this.log("main", "level started");
        this.nextScene(SceneKey.Level, params);
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

    private onResize() {
        this.optionsButton.updateRelativePosition();
        this.fullscreenButton.updateRelativePosition();
    }
}
