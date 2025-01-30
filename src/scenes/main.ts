import { UiButton } from "../entities/ui";
import { Scene } from "../shared/factories";
import { SceneKey } from "../shared/keys";

export type MainSceneParams = {
    levelSceneKey: string,
    levelSceneParams: Record<string, any>,
}

export class MainScene extends Scene(SceneKey.Main, {
    levelSceneKey: SceneKey.Game,
    levelSceneParams: {},
} as MainSceneParams) {
    optionsButton: UiButton;
    fullScreenButton: UiButton;

    isPaused: boolean = false;

    create() {
        super.create();

        this.scene.launch(
            this.params.levelSceneKey,
            this.params.levelSceneParams,
        );
        this.scene.bringToTop();

        this.events.on(Phaser.Core.Events.BLUR, this.pauseLevel, this);

        const { width, height } = this.scale;

        this.optionsButton = new UiButton(this, "OPT")
            .setPosition(16, height - 8)
            .setOnClick(() => this.handleOnClickOptions())
            .setAlpha(0.5)
            .setTint(0xff0000);
        this.fullScreenButton = new UiButton(this, "FS")
            .setPosition(width - 16, height - 8)
            .setOnClick(() => console.log('CLICKED FS'))
            .setAlpha(0.5)
            .setTint(0xff0000);
    }

    handleOnClickOptions() {
        this.isPaused
            ? this.unpauseLevel()
            : this.pauseLevel();
    }


    pauseLevel() {
        this.isPaused = true;
        this.scene.pause(this.params.levelSceneKey);
    }

    unpauseLevel() {
        this.isPaused = false;
        this.scene.resume(this.params.levelSceneKey);
    }
}
