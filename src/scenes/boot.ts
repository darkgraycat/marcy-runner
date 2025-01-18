import { Scene } from "../shared/factories";
import { DEBUG, GAMEPLAY, SETTINGS } from "../shared/settings";
import { EntityKey, AnimationKey, SceneKey, UiKey, AudioKey, FontKey } from "../shared/keys";
import { GameSceneParams } from "./game";
import { randomInt } from "../shared/utils";
import strings from "../data/strings";
import levels from "../data/levels";
import { UiText } from "../entities/ui";

export class BootScene extends Scene(SceneKey.Boot, {}) {
    textTitle: UiText;
    textObjectives: UiText;

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

        [   /* spritesheet */
            { key: EntityKey.Player, path: "assets/images/player.png", size: [16, 16] },
            { key: EntityKey.Buildings, path: "assets/images/buildings2.png", size: [48, 32] },
            { key: EntityKey.BuildingTops, path: "assets/images/building-tops2.png", size: [48, 16] },
            { key: EntityKey.Backgrounds, path: "assets/images/backgrounds2.png", size: [64, 32] },
            { key: EntityKey.Collectables, path: "assets/images/collectables2.png", size: [16, 16] },
        ].forEach(({ key, path, size: [frameWidth, frameHeight] }) =>
            this.load.spritesheet(key, path, { frameWidth, frameHeight })
        );

        [   /* font */
            { key: FontKey.Minogram, path: "assets/fonts/minogram_6x10.png", xml: "assets/fonts/minogram_6x10.xml" },
            { key: FontKey.Round, path: "assets/fonts/round_6x6.png", xml: "assets/fonts/round_6x6.xml" },
            { key: FontKey.Square, path: "assets/fonts/square_6x6.png", xml: "assets/fonts/square_6x6.xml" },
            { key: FontKey.Thick, path: "assets/fonts/thick_8x8.png", xml: "assets/fonts/thick_8x8.xml" },
            { key: FontKey.MKit, path: "assets/fonts/mkit-bitmap.png", xml: "assets/fonts/mkit-bitmap.xml" },
        ].forEach(({ key, path, xml }) => this.load.bitmapFont(key, path, xml));

    }

    create() {
        super.create();

        [   /* animaton */
            { key: AnimationKey.PlayerIdle, assetKey: EntityKey.Player, frames: [0, 1], frameRate: 8, repeat: -1 },
            { key: AnimationKey.PlayerWalk, assetKey: EntityKey.Player, frames: [5, 6, 6, 7], frameRate: 16, repeat: -1 },
            { key: AnimationKey.PlayerJump, assetKey: EntityKey.Player, frames: [4, 4, 6, 6], frameRate: 16, repeat: 0 },

            { key: AnimationKey.CollectablePanacatIdle, assetKey: EntityKey.Collectables, frames: [0, 1], frameRate: 8, repeat: -1 },
            { key: AnimationKey.CollectablePanacatDie, assetKey: EntityKey.Collectables, frames: [2, 3], frameRate: 16, repeat: 0 },

            { key: AnimationKey.CollectableBeanIdle, assetKey: EntityKey.Collectables, frames: [4, 5], frameRate: 8, repeat: -1 },
            { key: AnimationKey.CollectableBeanDie, assetKey: EntityKey.Collectables, frames: [6, 7], frameRate: 16, repeat: 0 },

            { key: AnimationKey.CollectableLifeIdle, assetKey: EntityKey.Collectables, frames: [8, 9], frameRate: 8, repeat: -1 },
            { key: AnimationKey.CollectableLifeDie, assetKey: EntityKey.Collectables, frames: [10, 11], frameRate: 16, repeat: 0 },
        ].forEach(({ key, assetKey, frames, frameRate, repeat }) =>
            this.anims.create({
                key,
                repeat,
                frameRate,
                frames: this.anims.generateFrameNames(assetKey, { frames }),
            })
        );

        const { width, height } = this.scale;
        this.textTitle = new UiText(this, strings.bootScene.title)
            .setTextArgs(SETTINGS.userName)
            .setOrigin(0.5)
            .setPosition(width / 2, 32);
        this.textObjectives = new UiText(this, strings.bootScene.objectives)
            .setTextArgs(GAMEPLAY.targetPoints)
            .setOrigin(0.5)
            .setTint(0xff8822)
            .setPosition(width / 2, height - 32);

        this.cameras.main.setBackgroundColor(0x000000);
        //this.cameras.main.fadeOut(5000, 0xff0000);
        //this.cameras.main.setBackgroundColor(0xffffff)

        if (DEBUG.fastRestart) return this.startGame();

        setTimeout(() => {
            this.input.keyboard.on('keydown', () => this.startGame());
            this.input.on('pointerdown', () => this.startGame());
        }, 1000);
    }

    private startGame() {
        this.scene.start(SceneKey.Game, {
            player: {
                moveVelocity: GAMEPLAY.initialSpeed,
                jumpVelocity: GAMEPLAY.initialHeight,
                maxJumps: 1,
            },
            state: {
                targetPoints: GAMEPLAY.targetPoints,
                initialLifes: GAMEPLAY.initialLifes,
                speedBonus: GAMEPLAY.speedBonusStep,
                speedBonusMax: GAMEPLAY.speedBonusMax,
                speedBonusTick: GAMEPLAY.speedBonusTick,
            },
            level: {
                // levelIdx: randomInt(0, levels.length),
                levelIdx: 0
            },
        } as GameSceneParams);
    }
}
