import { Scene } from "../shared/factories";
import { DEBUG, GAMEPLAY, SETTINGS } from "../shared/settings";
import { EntityKey, AnimationKey, SceneKey, UiKey, AudioKey, FontKey } from "../shared/keys";
import { GameSceneParams } from "./game";
import { randomInt } from "../shared/utils";
import strings from "../data/strings";
import levels, { LevelsDataBgIdxs } from "../data/levels";
import { UiButton, UiText } from "../entities/ui";
import { Background } from "../entities/background";

export class BootScene extends Scene(SceneKey.Boot, {}) {
    levelIdx: number;
    backgrounds: Phaser.GameObjects.Group;

    preload() {
        [   /* #audio */
            { key: AudioKey.MainTheme, path: "assets/audio/main_theme.mp3" },
            { key: AudioKey.Collect, path: "assets/audio/collect.mp3" },
            { key: AudioKey.Jump, path: "assets/audio/jump.mp3" },
            { key: AudioKey.Warp, path: "assets/audio/warp.mp3" },
            { key: AudioKey.Meow, path: "assets/audio/meow.mp3" },
        ].forEach(({ key, path }) => this.load.audio(key, path));

        // [   /* #image */
        //     { key: UiKey.Logo, path: "assets/images/murkit_logo.png" },
        //     { key: UiKey.LogoBig, path: "assets/images/murkit_logo_big.png" },
        //     { key: UiKey.Title, path: "assets/images/title.png" },
        //     { key: UiKey.UiMenu, path: "assets/images/ui_menu.png" },
        // ].forEach(({ key, path }) => this.load.image(key, path));

        [   /* #spritesheet */
            { key: EntityKey.Player, path: "assets/images/player.png", size: [16, 16] },
            { key: EntityKey.Buildings, path: "assets/images/buildings.png", size: [48, 32] },
            { key: EntityKey.BuildingRoofs, path: "assets/images/building-roofs.png", size: [48, 16] },
            { key: EntityKey.BuildingDecors, path: "assets/images/building-decors.png", size: [48, 32] },
            { key: EntityKey.Backgrounds, path: "assets/images/backgrounds.png", size: [64, 32] },
            { key: EntityKey.Collectables, path: "assets/images/collectables.png", size: [16, 16] },
        ].forEach(({ key, path, size: [frameWidth, frameHeight] }) =>
            this.load.spritesheet(key, path, { frameWidth, frameHeight })
        );

        [   /* #font */
            { key: FontKey.MKitText, path: "assets/fonts/mkit-text-7x8.png", xml: "assets/fonts/mkit-text-7x8.xml" },
        ].forEach(({ key, path, xml }) => this.load.bitmapFont(key, path, xml));

    }

    create() {
        super.create();
        this.scale.setMaxZoom();

        [   /* #animaton */
            { key: AnimationKey.PlayerIdle, assetKey: EntityKey.Player, frames: [0, 1, 2, 3, 4, 5], frameRate: 8, repeat: -1 },
            { key: AnimationKey.PlayerWalk, assetKey: EntityKey.Player, frames: [5, 6, 6, 7], frameRate: 16, repeat: -1 },
            { key: AnimationKey.PlayerJump, assetKey: EntityKey.Player, frames: [4, 4, 6, 6], frameRate: 16, repeat: 0 },
            { key: AnimationKey.PlayerRun, assetKey: EntityKey.Player, frames: [8, 9, 9, 10], frameRate: 20, repeat: -1 },

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
            }),
        );

        if (DEBUG.fastRestart) return this.startGame();
        if (DEBUG.fastDevmode) return this.startDevmode();

        /* #backgrounds */
        this.levelIdx = randomInt(0, levels.length)
        const level = levels[this.levelIdx];
        this.cameras.main.setBackgroundColor(level.sky);
        this.backgrounds = this.add.group({ runChildUpdate: false });
        for (const [frame, y, color, scrollScale] of level.backgrounds) {
            this.backgrounds.add(new Background(this, frame, y, scrollScale).setTint(color))
        }

        /* #ui */
        const { width, height } = this.scale;
        new UiText(this, strings.bootScene.title)
            .setTextArgs(SETTINGS.userName)
            .setPosition(width / 2, 32);

        new UiText(this, strings.bootScene.objectives)
            .setTextArgs(GAMEPLAY.targetPoints)
            .setTint(level.sky)
            .setPosition(width / 2, height - 16);

        new UiButton(this, strings.bootScene.buttonStart)
            .setPosition(width / 2, height - 64)
            .setOnClick(() => this.startGame())
            .setTint(level.backgrounds[2][LevelsDataBgIdxs.COLOR])
            .setSize(100, 16);

        new UiButton(this, strings.bootScene.buttonTutorial)
            .setPosition(width / 2, height - 40)
            .setOnClick(() => this.startTutorial())
            .setTint(level.backgrounds[2][LevelsDataBgIdxs.COLOR])
            .setSize(100, 16);

        /* cheats */
        let combination = '';
        this.input.keyboard.on('keydown', ({ key }) => {
            combination += key;
            if (key == ' ') combination = '';
            if (combination.endsWith('level')) return this.startGame({ levelIdx: +combination.split('level')[0] })
            if (combination == 'devmode') return this.startDevmode();
            if (combination == 'cocaine') return this.startGame({ speedBonus: 100, speedBonusMax: 500, jumpVelocity: 250 });
        });
    }

    update(time: number, delta: number): void {
        this.backgrounds.getChildren().forEach((c, index) => {
            const bg = c as Background;
            bg.tilePositionX += levels[this.levelIdx].backgrounds[index][LevelsDataBgIdxs.SCROLL_SCALE];
        });
    }

    private startGame(override: {
        moveVelocity?: number,
        jumpVelocity?: number,
        targetPoints?: number,
        initialLifes?: number,
        speedBonus?: number,
        speedBonusMax?: number,
        levelIdx?: number,
    } = {}) {
        this.scene.start(SceneKey.Game, {
            moveVelocity: override.moveVelocity || GAMEPLAY.initialMoveVelocity,
            jumpVelocity: override.jumpVelocity || GAMEPLAY.initialJumpVelocity,
            maxJumps: 1,
            targetPoints: override.targetPoints || GAMEPLAY.targetPoints,
            initialLifes: override.initialLifes || GAMEPLAY.initialLifes,
            speedBonus: override.speedBonus || GAMEPLAY.speedBonusStep,
            speedBonusMax: override.speedBonusMax || GAMEPLAY.speedBonusMax,
            speedBonusTick: GAMEPLAY.speedBonusTick,
            levelIdx: override.levelIdx ||  randomInt(0, levels.length),
        } as GameSceneParams);
    }

    private startTutorial() {
        this.scene.start(SceneKey.Tutorial, {});
    }

    private startDevmode() {
        this.scene.start(SceneKey.Devmode, { levelIdx: 4 });
    }
}
