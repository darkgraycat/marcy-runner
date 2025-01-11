import { AudioKey, FontKey, SceneKey } from "../shared/keys";
import { Scene } from "../shared/factories";
import { Player } from "../entities/player"
import { Background } from "../entities/background"
import { Building } from "../entities/building"
import { Collectable, CollectableType } from "../entities/collectable";
import { iterate, randomInt } from "../shared/utils";
import { OverSceneParams } from "./over";
import { GAME_DEFAULT_FONT, GAME_HEIGHT, GAME_WIDTH } from "../shared/constants";
import { SETTINGS } from "../shared/settings";

export type GameSceneLevelThemeConfig = {
    tints: number[];
    frames: number[];
    buildings: number,
    bg: number,
}

export type GameSceneParams = {
    initialSpeed: number;
    initialHeight: number;
    speedBonusMax: number;
    speedBonusStep: number;
    speedBonusTick: number;
    maxPoints: number;
    maxLifes: number,
    backgrounds: GameSceneLevelThemeConfig[];
}

export class GameScene extends Scene(SceneKey.Game, {
    initialSpeed: 100,
    initialHeight: 220,
    maxPoints: 50,
    maxLifes: 3,
    backgrounds: {},
} as GameSceneParams) {
    buttonPressed: boolean;
    canJumpTicks: number;

    backgrounds: Phaser.GameObjects.Group;
    buildings: Phaser.GameObjects.Group;
    collectables: Phaser.GameObjects.Group;
    player: Player;

    keyMoveLeft: Phaser.Input.Keyboard.Key;
    keyMoveRight: Phaser.Input.Keyboard.Key;
    keyJump: Phaser.Input.Keyboard.Key;

    cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
    scoreText: Phaser.GameObjects.BitmapText;
    statsText: Phaser.GameObjects.BitmapText;
    livesText: Phaser.GameObjects.BitmapText;
    distanceText: Phaser.GameObjects.BitmapText;

    previosBg: number;

    points: number;
    lifes: number;
    pointMilestones: number[];
    gameSpeedMod: number;
    gameSpeedModMax: number;

    fxJump: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound;
    fxWarp: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound;
    fxMeowLow: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound;
    fxMeowHigh: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound;
    fxCollect: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound;

    create() {
        super.create();

        this.fxJump = this.createSound(AudioKey.Jump, 0.1, -200);
        this.fxWarp = this.createSound(AudioKey.Warp, 0.3, -200);
        this.fxMeowLow = this.createSound(AudioKey.Meow, 0.4, -600);
        this.fxMeowHigh = this.createSound(AudioKey.Meow, 0.4, 400);
        this.fxCollect = this.createSound(AudioKey.Collect, 0.4, 400);

        const bgConfigs = this.params.backgrounds;

        const bgConfigsLen = bgConfigs.length;
        const rnd = randomInt(0, bgConfigsLen);
        const bgIdx = this.previosBg === rnd ? ((rnd + 1) % bgConfigsLen) : rnd;

        const { tints, frames, buildings, bg } = bgConfigs[bgIdx];

        this.previosBg = bgIdx;

        this.cameras.main.setBackgroundColor(bg);
        this.cameras.main.fadeIn(1000, 0xff, 0xff, 0xff);

        this.backgrounds = this.createBackgrounds(tints, frames);

        const totalBuildings = Math.round(2 * GAME_WIDTH / Building.tilesize);
        this.buildings = this.add.group(
            iterate(totalBuildings, i => new Building(this, Building.tilesize * i, 0.5, 0)
                .setTint(buildings)
            ),
            { runChildUpdate: true },
        );

        const totalCollectables = 10;
        this.collectables = this.add.group(
            iterate(totalCollectables, i => new Collectable(this, 32 * i, 400, 0xffffff)),
            { runChildUpdate: true },
        );

        /* player */
        this.player = new Player(this).setPosition(48, 64);
        this.cameras.main.startFollow(this.player, true, 1, 0, -72, 0);

        /* physics */
        this.physics.add.collider(this.buildings, this.player);
        this.physics.add.overlap(this.collectables, this.player, this.handleCollect, null, this);

        /* controls */
        this.keyMoveLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[SETTINGS.keyboardKeys.moveLeft]);
        this.keyMoveRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[SETTINGS.keyboardKeys.moveRight]);
        this.keyJump = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[SETTINGS.keyboardKeys.jump]);

        this.cursorKeys = this.input.keyboard.createCursorKeys();
        this.buttonPressed = false;

        /* text */
        this.scoreText = this.createText("", GAME_WIDTH / 2, GAME_HEIGHT).setOrigin(0.5, 1);
        this.distanceText = this.createText("", GAME_WIDTH, 4).setOrigin(1, 0);
        this.statsText = this.createText("", 4, 4).setOrigin(0);
        this.livesText = this.createText("", 32, 13).setOrigin(0).setTint(0xff4444);

        /* state */
        this.gameSpeedMod = 0;
        this.gameSpeedModMax = 0;
        this.points = 0;
        this.lifes = this.params.maxLifes;
        this.pointMilestones = [
            this.params.maxPoints * 0.25 | 0, // 25%
            this.params.maxPoints * 0.50 | 0, // 50%
            this.params.maxPoints * 0.75 | 0, // 75%
        ];
    }

    update() {
        this.handleControls();
        this.handleSpeedChange();
        this.handleUiText();

        if (this.player.y > GAME_HEIGHT) {
            this.handleLoseLife();
        }
    }

    handleUiText() {
        const scoreTxt = `Collected [${this.points} of ${this.params.maxPoints}]`;
        const heartsTxt = ';'.repeat(this.lifes)
        const caffeineTxt = 'Caffeine ' + '_'.repeat(Math.round(this.gameSpeedMod / this.params.speedBonusStep));
        const distanceTxt = `Distance ${this.cameras.main.scrollX.toFixed(0).padStart(6, '0')}`;
        this.scoreText.text = scoreTxt;
        this.statsText.text = `${caffeineTxt}\nLifes`;
        this.livesText.text = heartsTxt;
        this.distanceText.text = distanceTxt;
    }

    handleLoseLife() {
        console.log('Life lost', this.lifes);
        if (this.lifes > 0) {
            this.lifes--;
            return this.restart();
        }
        this.lose();
    }

    handleControls() {
        const { initialSpeed: gameSpeed, initialHeight: jumpHeight } = this.params;
        const isJumping = this.keyJump.isDown || this.input.activePointer.isDown;

        if (this.keyMoveLeft.isDown) {
            this.player.walk((gameSpeed + this.gameSpeedMod) * -1);

        } else if (this.keyMoveRight.isDown) {
            this.player.walk(gameSpeed + this.gameSpeedMod);

        } else {
            this.player.idle();
        }

        if (isJumping) {
            if (!this.buttonPressed) {
                this.player.jump(jumpHeight);
                if (this.player.touchingDown) this.fxJump.play();
            }
            this.buttonPressed = true;
        } else if (!this.player.touchingDown && this.player.body.velocity.y < 0) {
            this.player.body.velocity.y /= 2;
        } else {
            this.buttonPressed = false;
        }
    }

    handleSpeedChange() {
        this.gameSpeedMod -= this.params.speedBonusTick;
        if (this.gameSpeedMod < 0) this.gameSpeedMod = 0;
        if (this.gameSpeedMod > this.params.speedBonusMax) {
            this.gameSpeedMod = this.params.speedBonusMax;
        }

        if (this.gameSpeedModMax < this.gameSpeedMod) {
            this.gameSpeedModMax = this.gameSpeedMod;
        }
    }

    handleCollect(object1: any) { // handle Phaser's bad typings
        const collectable = object1 as Collectable;
        const collectableType = collectable.getType();

        switch (collectableType) {
            case CollectableType.Panacat: {
                this.fxCollect.play();
                this.points++;

                const [nextMilestone] = this.pointMilestones;
                if (this.points >= nextMilestone) {
                    this.fxMeowHigh.play();
                    this.pointMilestones.shift();
                }

                if (this.points >= this.params.maxPoints) {
                    this.win();
                }
                break;
            }
            case CollectableType.Bean: {
                this.fxWarp.play();
                this.gameSpeedMod += this.params.speedBonusStep;
                break;
            }
            default: {
                console.warn('Unhandled collectable type ' + collectableType);
                break;
            }
        }

        collectable.reset();
    }

    lose() {
        this.fxMeowLow.play();
        return this.startOver(
            "Don't be upset\nYou will succeed next time!",
            false,
        );
    }

    win() {
        return this.startOver(
            "CONGRATULATIONS\nYou collected all panacats!\nWelcome to Murkit to taste 'em!",
            true,
        );
    }

    restart() {
        this.player.setY(0);
    }

    startOver(message: string, finished: boolean) {
        this.scene.start(SceneKey.Over, {
            message,
            finished,
            points: this.points,
            distance: +this.cameras.main.scrollX.toFixed(0),
            maxSpeedMod: +this.gameSpeedModMax.toFixed(0),
        } as OverSceneParams);
    }

    private createBackgrounds(tints: number[], frames: number[]) {
        const [
            tintSkyTop, tintSkyMid, tintSkyBot,
            tintBgTop, tintBgFar, tintBgMid, tintBgBot,
        ] = tints;
        return this.add.group({ runChildUpdate: true })
            .add(new Background(this, 0.8, 1, 0.1, true).setTint(tintSkyTop))
            .add(new Background(this, 0.5, 1, 0.2, true).setTint(tintSkyMid))
            .add(new Background(this, 0.0, 1, 0.4, true).setTint(tintSkyBot))
            .add(new Background(this, 2.0, frames[0], 0.1).setTint(tintBgTop))
            .add(new Background(this, 2.2, frames[1], 0.2).setTint(tintBgFar))
            .add(new Background(this, 2.6, frames[2], 0.3).setTint(tintBgMid))
            .add(new Background(this, 3.0, frames[3], 0.5).setTint(tintBgBot));
    }


    private createSound(key: string, volume?: number, detune?: number, rate?: number) {
        return this.sound.add(key, {
            mute: SETTINGS.volumeMute,
            volume: SETTINGS.volumeEffects * volume,
            detune,
            rate,
        });
    }

    private createText(text: string, x: number, y: number, font = GAME_DEFAULT_FONT) {
        return this.add.bitmapText(x, y, font, text)
            .setScrollFactor(0);
    }
}
