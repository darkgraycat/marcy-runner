import { Scene } from "../shared/factories";
import { EntityKey, EntityAnimation, SceneKey, UiKey, AudioKey, FontKey, DataKey } from "../shared/keys";
import { DEBUG, GAMEPLAY } from "../shared/settings";
import { GameSceneLevelThemeConfig, GameSceneParams } from "./game";

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
            { key: DataKey.LevelTheme, path: "assets/json/level_theme.json" },
        ].forEach(({ key, path }) => this.load.json(key, path));


        [   /* spritesheet */
            { key: EntityKey.Player, path: "assets/images/player.png", size: [16, 16] },
            { key: EntityKey.Buildings, path: "assets/images/buildings2.png", size: [48, 32] },
            { key: EntityKey.BuildingTops, path: "assets/images/building-tops2.png", size: [48, 16] },
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
            { key: EntityAnimation.CollectablePillIdle, assetKey: EntityKey.Collectable, frames: [0, 1], frameRate: 8, repeat: -1 },
            { key: EntityAnimation.CollectablePillDie, assetKey: EntityKey.Collectable, frames: [2, 3], frameRate: 8, repeat: -1 },
            { key: EntityAnimation.CollectableDonutIdle, assetKey: EntityKey.Collectable, frames: [5], frameRate: 8, repeat: -1 },
            { key: EntityAnimation.CollectableBeanIdle, assetKey: EntityKey.Collectable, frames: [4], frameRate: 8, repeat: -1 },
            { key: EntityAnimation.CollectablePanacatIdle, assetKey: EntityKey.Collectable, frames: [6, 7], frameRate: 8, repeat: -1 },
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

        const txt = (message: string, x: number, y: number, scale = 1) => this.add.bitmapText(x, y, FontKey.Minogram, message).setOrigin(0.5).setScale(scale);
        txt("boot screen", 132, 32).setTint(0x000000);

        if (DEBUG.fastRestart) return this.startGame();

        setTimeout(() => {
            this.input.keyboard.on('keydown', () => this.startGame());
            this.input.on('pointerdown', () => this.startGame());
        }, 2000);
    }

    private startGame() {
        const backgroundConfigs = this.cache.json.get(DataKey.LevelTheme) as any[];
        const backgrounds: GameSceneLevelThemeConfig[] = backgroundConfigs.map(cfg => ({
            tints: cfg.tints.map((tint: string) => parseInt(`0x${tint}`, 16)),
            frames: cfg.frames,
            bg: parseInt(`0x${cfg.bg}`, 16),
            buildings: parseInt(`0x${cfg.buildings}`, 16),
        }));

        this.scene.start(SceneKey.Game, {
            maxLifes: GAMEPLAY.maximumLifes,
            maxPoints: GAMEPLAY.maximumPoints,
            initialSpeed: GAMEPLAY.initialSpeed,
            initialHeight: GAMEPLAY.initialHeight,
            speedBonusMax: GAMEPLAY.speedBonusMax,
            speedBonusStep: GAMEPLAY.speedBonusStep,
            speedBonusTick: GAMEPLAY.speedBonusTick,
            backgrounds,
        } as GameSceneParams);
    }
}
