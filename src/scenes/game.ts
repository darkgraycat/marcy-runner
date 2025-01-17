import levels from "../data/levels";
import strings from "../data/strings";
import { Background } from "../entities/background";
import { Building } from "../entities/building";
import { Collectable, CollectableType } from "../entities/collectable";
import { Player } from "../entities/player";
import { Sun } from "../entities/sun";
import { UiText } from "../entities/ui";
import { GAME_DEFAULT_FONT, GAME_HEIGHT, GAME_WIDTH } from "../shared/constants";
import { Scene } from "../shared/factories";
import { AudioKey, FontKey, SceneKey } from "../shared/keys";
import { SETTINGS } from "../shared/settings";
import { Point } from "../shared/types";
import { randomInt } from "../shared/utils";
import { OverSceneParams } from "./over";

export type GameSceneParams = {
    player: {
        moveVelocity: number,
        jumpVelocity: number,
    },
    state: {
        targetPoints: number,
        initialLifes: number,
        speedBonus: number,
        speedBonusMax: number,
        speedBonusTick: number,
    },
    level: {
        levelIdx: number,
    }
}

export class GameScene extends Scene(SceneKey.Game, {
    player: { moveVelocity: 100, jumpVelocity: 200 },
    state: { targetPoints: 100, initialLifes: 3, speedBonus: 25, speedBonusTick: 1, speedBonusMax: 10 },
    level: { levelIdx: 0 },
} as GameSceneParams) {
    player: Player;
    sun: Sun;
    backgrounds: Phaser.GameObjects.Group;
    buildings: Phaser.GameObjects.Group;
    collectables: Phaser.GameObjects.Group;

    inputJumping: boolean = false;
    inputJumpInProgress: boolean = false;

    stateIsRunning: boolean = false;
    stateSpeedMod: number = 0;
    stateSpeedModMax: number = 0;
    statePoints: number = 0;
    statePointMilestones: number[];
    stateLifesLeft: number = 3;

    fxJump: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound;
    fxWarp: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound;
    fxMeowLow: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound;
    fxMeowHigh: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound;
    fxCollect: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound;

    textPanacats: UiText;
    textCaffeine: UiText;
    textLifes: UiText;
    textMain: UiText;

    debugText: Phaser.GameObjects.BitmapText;

    create() {
        super.create();
        const level = levels[this.params.level.levelIdx];

        /* fx */
        this.fxJump = this.sound.add(AudioKey.Jump, { volume: SETTINGS.volumeEffects * 0.1, detune: -200 });
        this.fxWarp = this.sound.add(AudioKey.Warp, { volume: SETTINGS.volumeEffects * 0.3, detune: -200 });
        this.fxMeowLow = this.sound.add(AudioKey.Meow, { volume: SETTINGS.volumeEffects * 0.4, detune: -600 });
        this.fxMeowHigh = this.sound.add(AudioKey.Meow, { volume: SETTINGS.volumeEffects * 0.4, detune: 400 });
        this.fxCollect = this.sound.add(AudioKey.Collect, { volume: SETTINGS.volumeEffects * 0.4, detune: 400 });

        /* entities */
        this.sun = new Sun(this, 64, 32, 6);

        this.backgrounds = this.add.group({ runChildUpdate: true });
        for (const [frame, y, color, scrollScale, autoScroll] of level.backgrounds) {
            this.backgrounds.add(new Background(this, frame, y, scrollScale, autoScroll).setColor(color))
        }

        this.buildings = this.add.group({ runChildUpdate: true });
        const totalBuildings = Math.round(2 * GAME_WIDTH / Building.tilesize);
        for (let i = 0; i < totalBuildings; i++) {
            this.buildings.add(new Building(this, Building.tilesize * i, 48, i % 5).setColor(level.buildings))
        }

        this.collectables = this.add.group({ runChildUpdate: true });
        const totalCollectables = 12;
        for (let i = 0; i < totalCollectables; i++) {
            this.collectables.add(new Collectable(this, 32 * i, 400, 0xffffff));
        }

        this.player = new Player(this).setPosition(48, 64);

        /* controls */
        this.input.keyboard.on(`keydown-SPACE`, () => this.handleActionKey(true));
        this.input.keyboard.on(`keyup-SPACE`, () => this.handleActionKey(false));
        this.input.on('pointerdown', () => this.handleActionKey(true));
        this.input.on('pointerup', () => this.handleActionKey(false));

        /* physics */
        this.physics.add.collider(this.buildings, this.player);
        this.physics.add.overlap(this.collectables, this.player, this.handleCollect, null, this);

        this.debugText = this.add.bitmapText(16, 16, FontKey.Minogram, "").setScrollFactor(0);

        /* text */
        this.textLifes = new UiText(this, strings.gameScene.lifesLeft)
            .setOrigin(0, 0)
            .setPosition(4, 4);
        this.textPanacats = new UiText(this, strings.gameScene.panacatsCollected)
            .setOrigin(1, 0)
            .setPosition(GAME_WIDTH - 4, 4);
        this.textCaffeine = new UiText(this, strings.gameScene.caffeine)
            .setOrigin(0.5)
            .setPosition(GAME_WIDTH / 2, GAME_HEIGHT - 8);
        this.textMain = new UiText(this)
            .setOrigin(0.5)
            .setPosition(GAME_WIDTH / 2, GAME_HEIGHT / 2)
            .setScale(4)
            .setAlpha(0);

        /* other */
        this.cameras.main
            .setBackgroundColor(level.sky)
            .startFollow(this.player, true, 0.2, 0, -96, 0);

        this.statePointMilestones = [
            this.params.state.targetPoints * 0.25 | 0, // 25%
            this.params.state.targetPoints * 0.50 | 0, // 50%
            this.params.state.targetPoints * 0.75 | 0, // 75%
        ];
        this.stateLifesLeft = this.params.state.initialLifes;

        this.events.on(Building.EventSpawned, (payload: Point) => this.handleBuildingRespawn(payload));

        this.handlePlayerRespawn();
    }

    update(time: number, delta: number): void {
        this.handlePlayer(delta);
        this.handleSpeedChange();
        this.handleUiText();

    }

    private handleActionKey(isDown: boolean) {
        if (this.stateIsRunning) {
            this.inputJumping = isDown;
        } else {
        }
    }

    private handlePlayer(delta: number) {
        const { player: { moveVelocity, jumpVelocity } } = this.params;

        if (this.stateIsRunning) {
            this.player.move(moveVelocity + this.stateSpeedMod);
        } else {
            this.player.idle();
        }

        if (this.player.onGround) {
            this.inputJumpInProgress = false;
        } else if (!this.inputJumping && this.player.body.velocity.y < 0) {
            this.player.body.velocity.y /= 2; // still in air, but jump key no longer active
        }

        if (this.inputJumping && !this.inputJumpInProgress) {
            this.player.jump(jumpVelocity);
            this.inputJumpInProgress = true;
            if (this.player.onGround)
                this.fxJump.play();
        }

        if (this.player.y > GAME_HEIGHT) {
            this.handleLoseLife();
        }
    }

    private handleLoseLife() {
        if (this.stateLifesLeft > 0) {
            this.stateLifesLeft--;
            this.stateIsRunning = false;
            this.handlePlayerRespawn();
        } else {
            this.lose();
        }
    }

    private handlePlayerRespawn() {
        const entries = this.buildings.getChildren() as Building[];
        const safeBuilding = entries
            .filter((b) => b.x > this.player.x)
            .sort((a, b) => a.x - b.x)
            .filter((b) => b.y > 32)[0];
        this.player.x = safeBuilding.x + 8;
        this.player.y = safeBuilding.y - 16;
        this.stateSpeedMod = 0;
        this.inputJumping = false;
        this.inputJumpInProgress = false;

        this.startRunning();
    }

    handleBuildingRespawn(payload: Point) {
        const [x, y] = payload;
        if (y > GAME_HEIGHT * 0.8) return;

        const typeToSpawn = Collectable.randomType;
        const amountToSpawn = typeToSpawn == CollectableType.Life
            ? 1 // life is only spawned as 1
            : randomInt(1, 4); // 1, 2, or 3

        const collectablesToRespawn = this.collectables
            .getChildren()
            .filter(c => !c.active)
            .slice(0, amountToSpawn) as Collectable[];
        if (!collectablesToRespawn.length) return;

        const offsets = {
            1: [[24, -16]],
            2: [[24 - 8, -16], [24 + 8, -16]],
            3: [[24 - 8, -16], [24 + 8, -16], [24, -16 - 8]],
        }[collectablesToRespawn.length];

        const height = {
            [CollectableType.Bean]: 16,
            [CollectableType.Life]: 32,
        }[typeToSpawn] || 0;

        collectablesToRespawn.forEach((c, i) => c.respawn(
            x + offsets[i][0],
            y + offsets[i][1] - height,
            typeToSpawn,
        ));
    }


    private handleSpeedChange() {
        this.stateSpeedMod -= this.params.state.speedBonusTick;
        if (this.stateSpeedMod < 0) this.stateSpeedMod = 0;
        if (this.stateSpeedMod > this.params.state.speedBonusMax) {
            this.stateSpeedMod = this.params.state.speedBonusMax;
        }

        if (this.stateSpeedModMax < this.stateSpeedMod) {
            this.stateSpeedModMax = this.stateSpeedMod;
        }
    }

    private handleCollect(obj: any) {
        const collectable = obj as Collectable;

        switch (collectable.currentType) {
            case CollectableType.Panacat: {
                this.fxCollect.play();
                this.statePoints++;

                const [nextMilestone] = this.statePointMilestones;
                if (this.statePoints >= nextMilestone) {
                    this.fxMeowHigh.play();
                    this.statePointMilestones.shift();
                }

                if (this.statePoints >= this.params.state.targetPoints) {
                    this.win();
                }
                break;
            }
            case CollectableType.Bean: {
                this.fxWarp.play();
                this.stateSpeedMod += this.params.state.speedBonus;
                break;
            }
            case CollectableType.Life: {
                this.fxMeowHigh.play();
                this.stateLifesLeft++;
                break;
            }
        }

        collectable.collect();
    }

    private handleUiText() {
        this.textPanacats.setTextArgs(this.statePoints);
        this.textCaffeine.setTextArgs('`'.repeat(Math.round(this.stateSpeedMod / this.params.state.speedBonus)));
        this.textLifes.setTextArgs(';'.repeat(this.stateLifesLeft));
    }

    private lose() {
        this.fxMeowLow.play();
        return this.startOver(
            "Don't be upset\nYou will succeed next time!",
            false,
        );
    }

    private win() {
        return this.startOver(
            "CONGRATULATIONS\nYou collected all panacats!\nWelcome to Murkit to taste 'em!",
            true,
        );
    }

    // TODO: refactor
    private startRunning() {
        this.showMainText("3", () => {
            this.showMainText("2", () => {
                this.showMainText("1", () => {
                    this.showMainText("GO", () => {
                        this.stateIsRunning = true;
                    });
                });
            });
        });
    }


    // TODO: refactor, dont like one-shot approach
    private showMainText(text: string, callback: () => void) {
        const duration = 111;
        this.textMain.setText(text);
        this.tweens.chain({
            targets: this.textMain,
            tweens: [
                { alpha: 1, duration },
                { alpha: 1, duration },
                { alpha: 0, duration },
            ],
            onComplete: callback
        });
    }


    startOver(message: string, finished: boolean) {
        this.scene.start(SceneKey.Over, {
            message,
            finished,
            points: this.statePoints,
            distance: +this.cameras.main.scrollX.toFixed(0),
            maxSpeedMod: +this.stateSpeedModMax.toFixed(0),
        } as OverSceneParams);
    }
}
