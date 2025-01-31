import { UiTextButton } from "../entities/ui";
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
    optionsButton: UiTextButton;
    fullScreenButton: UiTextButton;

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

        this.optionsButton = new UiTextButton(this, "OPT")
            .setOrigin(0, 0.5)
            .setPosition(0, height - 8)
            .setOnClick(() => this.handleOnClickOptions());

        this.fullScreenButton = new UiTextButton(this, "FS")
            .setOrigin(1, 0.5)
            .setPosition(width, height - 8)
            .setOnClick(() => console.log('CLICKED FS'));
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
