import { Scene } from "../shared/factories";
import { AnimationKey, AudioKey, FontKey, SceneKey, SpriteKey } from "../shared/keys";

const defaults = {};

export type PreloadSceneParams = typeof defaults;

export class PreloadScene extends Scene<PreloadSceneParams>(SceneKey.Preload, defaults) {
    preload() {
        /* #audio */
        [
            { key: AudioKey.MainTheme, path: "assets/audio/main_theme.mp3" },
            { key: AudioKey.Collect, path: "assets/audio/collect.mp3" },
            { key: AudioKey.Jump, path: "assets/audio/jump.mp3" },
            { key: AudioKey.Warp, path: "assets/audio/warp.mp3" },
            { key: AudioKey.Meow, path: "assets/audio/meow.mp3" },
        ].forEach(({ key, path }) =>
            this.load.audio(key, path)
        );

        /* #spritesheet */
        [
            { key: SpriteKey.Player, path: "assets/images/player.png", size: [16, 16] },
            { key: SpriteKey.Buildings, path: "assets/images/buildings.png", size: [48, 32] },
            { key: SpriteKey.BuildingRoofs, path: "assets/images/building-roofs.png", size: [48, 16] },
            { key: SpriteKey.BuildingDecors, path: "assets/images/building-decors.png", size: [48, 32] },
            { key: SpriteKey.Backgrounds, path: "assets/images/backgrounds.png", size: [128, 32] },
            { key: SpriteKey.Collectables, path: "assets/images/collectables.png", size: [16, 16] },
        ].forEach(({ key, path, size: [frameWidth, frameHeight] }) =>
            this.load.spritesheet(key, path, { frameWidth, frameHeight })
        );

        /* #font */
        [   
            { key: FontKey.MKitText, path: "assets/fonts/mkit-text-7x8.png", xml: "assets/fonts/mkit-text-7x8.xml" },
        ].forEach(({ key, path, xml }) => this.load.bitmapFont(key, path, xml));

    }

    create() {
        super.create();

        /* #animaton */
        [   
            { key: AnimationKey.PlayerIdle, assetKey: SpriteKey.Player, frames: [0, 1, 2, 3, 4, 5], frameRate: 8, repeat: -1 },
            { key: AnimationKey.PlayerWalk, assetKey: SpriteKey.Player, frames: [5, 6, 6, 7], frameRate: 16, repeat: -1 },
            { key: AnimationKey.PlayerJump, assetKey: SpriteKey.Player, frames: [4, 4, 6, 6], frameRate: 16, repeat: 0 },
            { key: AnimationKey.PlayerRun, assetKey: SpriteKey.Player, frames: [8, 9, 9, 10], frameRate: 20, repeat: -1 },

            { key: AnimationKey.CollectablePanacatIdle, assetKey: SpriteKey.Collectables, frames: [0, 1], frameRate: 8, repeat: -1 },
            { key: AnimationKey.CollectablePanacatDie, assetKey: SpriteKey.Collectables, frames: [2, 3], frameRate: 16, repeat: 0 },

            { key: AnimationKey.CollectableBeanIdle, assetKey: SpriteKey.Collectables, frames: [4, 5], frameRate: 8, repeat: -1 },
            { key: AnimationKey.CollectableBeanDie, assetKey: SpriteKey.Collectables, frames: [6, 7], frameRate: 16, repeat: 0 },

            { key: AnimationKey.CollectableLifeIdle, assetKey: SpriteKey.Collectables, frames: [8, 9], frameRate: 8, repeat: -1 },
            { key: AnimationKey.CollectableLifeDie, assetKey: SpriteKey.Collectables, frames: [10, 11], frameRate: 16, repeat: 0 },
        ].forEach(({ key, assetKey, frames, frameRate, repeat }) =>
            this.anims.create({
                key,
                repeat,
                frameRate,
                frames: this.anims.generateFrameNames(assetKey, { frames }),
            }),
        );

        this.scene.stop();
        this.scene.start(SceneKey.Main);
    }
}
