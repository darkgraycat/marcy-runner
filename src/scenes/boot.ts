import { Scene } from "../shared/factories";
import { EntityKey, EntityAnimation, SceneKey, UiKey, AudioKey, FontKey, DataKey } from "../shared/keys";
import { DEBUG, GAMEPLAY, SETTINGS } from "../shared/settings";
import { GameSceneLevelThemeConfig, GameSceneParams } from "./game";

export class BootScene extends Scene(SceneKey.Boot, {}) {
    preload() {
        this.load.audio(AudioKey.MainTheme, "assets/audio/main_theme.mp3");
        this.load.audio(AudioKey.Collect, "assets/audio/collect.mp3");
        this.load.audio(AudioKey.Jump, "assets/audio/jump.mp3");
        this.load.audio(AudioKey.Warp, "assets/audio/warp.mp3");
        this.load.audio(AudioKey.Meow, "assets/audio/meow.mp3");

        this.load.image(UiKey.Logo, "assets/images/murkit_logo.png");
        this.load.image(UiKey.LogoBig, "assets/images/murkit_logo_big.png");
        this.load.image(UiKey.Title, "assets/images/title.png");
        this.load.image(UiKey.UiMenu, "assets/images/ui_menu.png");

        this.load.json(DataKey.LevelTheme, "assets/json/level_theme.json");

        this.load.spritesheet(EntityKey.Player, "assets/images/player.png", { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet(EntityKey.Building, "assets/images/buildings.png", { frameWidth: 48, frameHeight: 32 });
        this.load.spritesheet(EntityKey.BuildingTop, "assets/images/building_tops.png", { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet(EntityKey.Collectable, "assets/images/collectables.png", { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet(EntityKey.Background, "assets/images/backgrounds.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet(EntityKey.Foreground, "assets/images/foregrounds.png", { frameWidth: 48, frameHeight: 32 });
        this.load.spritesheet(EntityKey.Object, "assets/images/objects.png", { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet(EntityKey.Block, "assets/images/blocks.png", { frameWidth: 16, frameHeight: 16 });

        this.loadFont(FontKey.Minogram, 'minogram_6x10');
        this.loadFont(FontKey.Round, 'round_6x6');
        this.loadFont(FontKey.Square, 'square_6x6');
        this.loadFont(FontKey.Thick, 'thick_8x8');
    }

    create() {
        super.create();

        this.cameras.main.fadeIn(5000, 0x000000);
        this.cameras.main.setBackgroundColor(0xffffff)

        // this.add.image(512, 384 - 64, UiKey.LogoBig)
        //     .setOrigin(0.5, 0.5)
        //     .setScale(0.8);

        const txt = (message: string, x: number, y: number, scale = 1) => this.add.bitmapText(x, y, FontKey.Minogram, message).setOrigin(0.5).setScale(scale);
        txt("boot screen", 132, 32).setTint(0x000000)

        // this.sound.add(AudioKey.MainTheme, {
        //     mute: SETTINGS.volumeMute,
        //     volume: SETTINGS.volumeMusic,
        //     rate: 1,
        //     detune: -400,
        //     seek: 0,
        //     loop: true,
        //     delay: 0
        // }).play();

        this.loadAnimation(EntityAnimation.PlayerWalk, EntityKey.Player, [1, 2, 3, 0], 16);
        this.loadAnimation(EntityAnimation.PlayerIdle, EntityKey.Player, [0, 0, 3, 3], 8);
        this.loadAnimation(EntityAnimation.PlayerJump, EntityKey.Player, [1, 1, 2, 2], 16, 0);

        this.loadAnimation(EntityAnimation.CollectablePillIdle, EntityKey.Collectable, [0, 1], 8);
        this.loadAnimation(EntityAnimation.CollectablePillDie, EntityKey.Collectable, [2, 3], 8);
        this.loadAnimation(EntityAnimation.CollectableDonutIdle, EntityKey.Collectable, [5], 8);
        this.loadAnimation(EntityAnimation.CollectableBeanIdle, EntityKey.Collectable, [4], 8);
        this.loadAnimation(EntityAnimation.CollectablePanacatIdle, EntityKey.Collectable, [6, 7], 8);

        if (DEBUG.fastRestart) return this.startGame();

        setTimeout(() => {
            this.input.keyboard.on('keydown', () => this.startGame());
            this.input.on('pointerdown', () => this.startGame());
        }, 2000);
    }

    private startGame() {
        this.scene.start(SceneKey.Game, { 
            maxLifes: GAMEPLAY.maximumLifes,
            maxPoints: GAMEPLAY.maximumPoints,
            initialSpeed: GAMEPLAY.initialSpeed,
            initialHeight: GAMEPLAY.initialHeight,
            speedBonusMax: GAMEPLAY.speedBonusMax,
            speedBonusStep: GAMEPLAY.speedBonusStep,
            speedBonusTick: GAMEPLAY.speedBonusTick,
            
            backgrounds: this.parseBackgroundConfigs(),
        } as GameSceneParams);
    }

    private loadAnimation(key: string, assetKey: string, frames: number[], rate = 10, repeat = -1) {
        this.anims.create({
            key,
            repeat,
            frameRate: rate,
            frames: this.anims.generateFrameNames(assetKey, { frames }),
        });
        return this;
    }

    private loadFont(assetKey: string, filename: string) {
        this.load.bitmapFont(
            assetKey,
            `assets/fonts/${filename}.png`,
            `assets/fonts/${filename}.xml`,
        );
        return this;
    }

    private parseBackgroundConfigs(): GameSceneLevelThemeConfig[] {
        const bgCfgs = this.cache.json.get(DataKey.LevelTheme) as any[];
        return bgCfgs.map(cfg => ({
            tints: cfg.tints.map((tint: string) => parseInt(`0x${tint}`, 16)),
            frames: cfg.frames,
            bg: parseInt(`0x${cfg.bg}`, 16),
            buildings: parseInt(`0x${cfg.buildings}`, 16),
        }));
    }

}
