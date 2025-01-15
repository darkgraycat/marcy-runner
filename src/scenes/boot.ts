import { Scene } from "../shared/factories";
import { DEBUG, GAMEPLAY } from "../shared/settings";
import { EntityKey, EntityAnimation, SceneKey, UiKey, AudioKey, FontKey, DataKey } from "../shared/keys";
import { GameSceneParams } from "./game";
import { LevelsJsonData } from "../shared/types";
import { randomInt } from "../shared/utils";

export class BootScene extends Scene(SceneKey.Boot, {}) {
    preload() {
        [   /* audio */
            { key: AudioKey.MainTheme, path: "assets/audio/main_theme.mp3" },
            { key: AudioKey.Collect, path: "assets/audio/collect.mp3" },
            { key: AudioKey.Jump, path: "assets/audio/jump.mp3" },
            { key: AudioKey.Warp, path: "assets/audio/warp.mp3" },
            { key: AudioKey.Meow, path: "assets/audio/meow.mp3" },
        ].forEach(({ key, path }) => this.load.audio(key, path));

        [   /* image */
            { key: UiKey.Logo, path: "assets/images/murkit_logo.png" },
            { key: UiKey.LogoBig, path: "assets/images/murkit_logo_big.png" },
            { key: UiKey.Title, path: "assets/images/title.png" },
            { key: UiKey.UiMenu, path: "assets/images/ui_menu.png" },
        ].forEach(({ key, path }) => this.load.image(key, path));

        [   /* json */
            { key: DataKey.Strings, path: "assets/json/strings.json" },
            { key: DataKey.Levels, path: "assets/json/levels.json" },
            { key: DataKey.LevelTheme, path: "assets/json/level_theme.json" },
        ].forEach(({ key, path }) => this.load.json(key, path));

        [   /* spritesheet */
            { key: EntityKey.Player, path: "assets/images/player.png", size: [16, 16] },
            { key: EntityKey.Buildings, path: "assets/images/buildings2.png", size: [48, 32] },
            { key: EntityKey.BuildingTops, path: "assets/images/building-tops2.png", size: [48, 16] },
            { key: EntityKey.Backgrounds, path: "assets/images/backgrounds2.png", size: [64, 32] },
            { key: EntityKey.Collectables, path: "assets/images/collectables.png", size: [16, 16] },
        ].forEach(({ key, path, size: [frameWidth, frameHeight] }) =>
            this.load.spritesheet(key, path, { frameWidth, frameHeight })
        );

        [   /* font */
            { key: FontKey.Minogram, path: "assets/fonts/minogram_6x10.png", xml: "assets/fonts/minogram_6x10.xml" },
            { key: FontKey.Round, path: "assets/fonts/round_6x6.png", xml: "assets/fonts/round_6x6.xml" },
            { key: FontKey.Square, path: "assets/fonts/square_6x6.png", xml: "assets/fonts/square_6x6.xml" },
            { key: FontKey.Thick, path: "assets/fonts/thick_8x8.png", xml: "assets/fonts/thick_8x8.xml" },
        ].forEach(({ key, path, xml }) => this.load.bitmapFont(key, path, xml));
    }

    create() {
        super.create();

        [   /* animaton */
            { key: EntityAnimation.PlayerIdle, assetKey: EntityKey.Player, frames: [0, 1], frameRate: 8, repeat: -1 },
            { key: EntityAnimation.PlayerWalk, assetKey: EntityKey.Player, frames: [5, 6, 6, 7], frameRate: 16, repeat: -1 },
            { key: EntityAnimation.PlayerJump, assetKey: EntityKey.Player, frames: [4, 4, 6, 6], frameRate: 16, repeat: 0 },
            { key: EntityAnimation.CollectablePillIdle, assetKey: EntityKey.Collectables, frames: [0, 1], frameRate: 8, repeat: -1 },
            { key: EntityAnimation.CollectablePillDie, assetKey: EntityKey.Collectables, frames: [2, 3], frameRate: 8, repeat: -1 },
            { key: EntityAnimation.CollectableDonutIdle, assetKey: EntityKey.Collectables, frames: [5], frameRate: 8, repeat: -1 },
            { key: EntityAnimation.CollectableBeanIdle, assetKey: EntityKey.Collectables, frames: [4], frameRate: 8, repeat: -1 },
            { key: EntityAnimation.CollectablePanacatIdle, assetKey: EntityKey.Collectables, frames: [6, 7], frameRate: 8, repeat: -1 },
        ].forEach(({ key, assetKey, frames, frameRate, repeat }) =>
            this.anims.create({
                key,
                repeat,
                frameRate,
                frames: this.anims.generateFrameNames(assetKey, { frames }),
            })
        );

        this.cameras.main.fadeIn(5000, 0x000000);
        this.cameras.main.setBackgroundColor(0xffffff)

        this.add.bitmapText(132, 32, FontKey.Minogram, "boot screen").setOrigin(0.5);


        // if (DEBUG.fastRestart) return this.startGame();
        if (DEBUG.fastRestart) return this.startGame();

        // setTimeout(() => {
        //     this.input.keyboard.on('keydown', () => this.startGame());
        //     this.input.on('pointerdown', () => this.startGame());
        // }, 2000);
    }

    private startGame() {
        const levelData: LevelsJsonData[] = this.cache.json.get(DataKey.Levels);
        this.scene.start(SceneKey.Game2, {
            player: {
                moveVelocity: GAMEPLAY.initialSpeed,
                jumpVelocity: GAMEPLAY.initialHeight,
                maxJumps: 1,
            },
            state: {
                targetPoints: GAMEPLAY.maximumPoints,
                initialLifes: GAMEPLAY.maximumLifes,
                speedBonus: GAMEPLAY.speedBonusStep,
                speedBonusMax: GAMEPLAY.speedBonusMax,
                speedBonusTick: GAMEPLAY.speedBonusTick,
            },
            level: {
                // levelIdx: randomInt(0, levelData.length),
                levelIdx: 0,
            },
        } as GameSceneParams);
    }
}
