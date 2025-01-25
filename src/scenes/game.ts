import levels from "../data/levels";
import strings from "../data/strings";
import { Background } from "../entities/background";
import { Collectable, CollectableKind } from "../entities/collectable";
import { Player } from "../entities/player";
import { Sun } from "../entities/sun";
import { UiText } from "../entities/ui";
import { Scene } from "../shared/factories";
import { AudioKey, EventKey, SceneKey } from "../shared/keys";
import { Point } from "../shared/types";
import { iterate, randomBool, randomInt } from "../shared/utils";
import { OverSceneParams } from "./over";
import { DEBUG, SETTINGS } from "../shared/settings";
import { GAME_HEIGHT, GAME_WIDTH } from "../shared/constants";
import { Building } from "../entities/building";
import { BuildingRoof } from "../entities/building-roof";
import { BuildingDecor, BuildingDecorKind } from "../entities/building-decor";

export type GameSceneParams = {
    moveVelocity: number,
    jumpVelocity: number,
    targetPoints: number,
    initialLifes: number,
    speedBonus: number,
    speedBonusMax: number,
    speedBonusTick: number,
    levelIdx: number,
}

export class GameScene extends Scene(SceneKey.Game, {
    moveVelocity: 100,
    jumpVelocity: 200,
    targetPoints: 100,
    initialLifes: 3,
    speedBonus: 25,
    speedBonusTick: 1,
    speedBonusMax: 10,
    levelIdx: 0,
} as GameSceneParams) {
    player: Player;
    sun: Sun;
    backgrounds: Phaser.GameObjects.Group;
    buildings: Phaser.GameObjects.Group;
    buildingRoofs: Phaser.GameObjects.Group;
    buildingDecors: Phaser.GameObjects.Group;
    collectables: Phaser.GameObjects.Group;

    isJumping: boolean = false;
    isJumpInProgress: boolean = false;

    isRunning: boolean = false;
    speedBonus: number = 0;
    speedBonusMax: number = 0;

    pointsCollected: number = 0;
    pointMilestones: number[];
    lifesLeft: number = 3;

    textPanacats: UiText;
    textCaffeine: UiText;
    textLifes: UiText;
    textMain: UiText;

    create() {
        super.create();
        const level = levels[this.params.levelIdx];
        const totalBuildings = Math.round(2 * GAME_WIDTH / Building.config.tilesize[0]);
        const totalCollectables = 12;

        /* #entities */
        this.sun = new Sun(this, 64, 32, 6);

        this.backgrounds = this.add.group({ runChildUpdate: true });
        for (const [frame, y, color, scrollScale] of level.backgrounds) {
            this.backgrounds.add(new Background(this, frame, y, scrollScale).setTint(color))
        }

        this.buildings = this.add.group({ runChildUpdate: true });
        iterate(totalBuildings, i =>
            this.buildings.add(new Building(this, i, 1.5)
                .setTint(level.buildings)
                .setRandomFrame()
            )
        );

        this.buildingRoofs = this.add.group();
        iterate(totalBuildings, i =>
            this.buildingRoofs.add(new BuildingRoof(this, i, 5)
                .setTint(level.buildings)
                .setRandomFrame()
            )
        );

        this.buildingDecors = this.add.group();
        iterate(totalBuildings, i =>
            this.buildingDecors.add(new BuildingDecor(this, i - 12, 5)
                .setTint(Phaser.Display.Color.IntegerToColor(level.buildings).darken(10).color)
                .setRandomFrame()
            )
        );

        this.collectables = this.add.group({ runChildUpdate: true });
        iterate(totalCollectables, i =>
            this.collectables.add(new Collectable(this, 32 * i, 400))
        );

        /* #player */
        this.player = new Player(this).setPosition(48, 64);

        /* #controls */
        this.input.keyboard.on(`keydown-SPACE`, () => this.handleActionKey(true));
        this.input.keyboard.on(`keyup-SPACE`, () => this.handleActionKey(false));
        this.input.on('pointerdown', () => this.handleActionKey(true));
        this.input.on('pointerup', () => this.handleActionKey(false));

        /* #physics */
        this.physics.add.collider(this.buildings, this.player);
        this.physics.add.overlap(this.collectables, this.player, this.handleCollect, null, this);

        /* #ui */
        this.textLifes = new UiText(this, strings.gameScene.lifesLeft)
            .setPosition(4, 4)
            .setOrigin(0, 0)
            .setDepth(99);
        this.textPanacats = new UiText(this, strings.gameScene.panacatsCollected)
            .setPosition(GAME_WIDTH / 2, 4)
            .setOrigin(0.5, 0)
            .setDepth(99);
        this.textCaffeine = new UiText(this, strings.gameScene.caffeine)
            .setOrigin(1, 0)
            .setPosition(GAME_WIDTH - 4, 4);
        this.textMain = new UiText(this)
            .setPosition(GAME_WIDTH / 2, GAME_HEIGHT / 2)
            .setDepth(99)
            .setScale(4)
            .setAlpha(0);

        /* other */
        this.cameras.main
            .setBackgroundColor(level.sky)
            .startFollow(this.player, true, 1, 0, -80, 0);

        this.pointMilestones = [
            this.params.targetPoints * 0.25 | 0, // 25%
            this.params.targetPoints * 0.50 | 0, // 50%
            this.params.targetPoints * 0.75 | 0, // 75%
        ];
        this.lifesLeft = this.params.initialLifes;

        this.events.on(EventKey.BuildingSpawned, (payload: Point) => this.handleBuildingRespawn(payload));

        this.handlePlayerRespawn();
    }

    update(time: number, delta: number): void {
        this.handlePlayer(delta);
        this.handleSpeedChange();
        this.handleUiText();
    }


    private handlePlayer(delta: number) {
        const { moveVelocity, jumpVelocity } = this.params;

        if (this.isRunning) {
            this.player.move(moveVelocity + this.speedBonus);
        } else {
            this.player.idle();
        }

        if (this.player.onGround) {
            if (!this.isJumping) this.isJumpInProgress = false;
        } else if (!this.isJumping && this.player.body.velocity.y < 0) {
            this.player.body.velocity.y /= 2; // still in air, but jump key no longer active
        }

        if (this.isJumping && !this.isJumpInProgress) {
            this.isJumpInProgress = true;
            this.player.jump(jumpVelocity); // continue jump
        }

        if (this.player.y > GAME_HEIGHT * 2 && this.isRunning) {
            this.handleLoseLife();
        }
    }

    private handleLoseLife() {
        this.isRunning = false;
        this.player.meow(-4);
        if (this.lifesLeft > 1) {
            this.lifesLeft--;
            this.handlePlayerRespawn();
        } else {
            this.lose();
        }
    }

    private handlePlayerRespawn() {
        const entries = this.buildings.getChildren() as Building[];
        const safeBuilding = entries
            .filter((b) => b.x > this.player.x && b.y < GAME_HEIGHT)
            .sort((a, b) => a.x - b.x)[0];
        if (safeBuilding) {
            this.player.x = safeBuilding.x + 16;
            this.player.y = safeBuilding.y - 16;
        } else {
            console.warn("no safe building for spawn");
            this.player.y = 0;
        }
        console.log("respawned at", { x: this.player.x, y: this.player.y });
        this.speedBonus = 0;
        this.isJumping = false;
        this.isJumpInProgress = false;

        this.startRunning();
    }

    handleBuildingRespawn(payload: Point) {
        const [x, y] = payload;
        // respawn building roofs and decorations
        {
            const [tileWidth] = Building.config.tilesize;
            const findFree = (e: any) => (e.x + tileWidth) < this.cameras.main.scrollX;

            const decor = this.buildingDecors.getChildren().find(findFree) as BuildingDecor;

            if (y < GAME_HEIGHT) {
                const roof = this.buildingRoofs.getChildren().find(findFree) as BuildingRoof;
                if (roof) roof.setPosition(x, y).setRandomFrame();

                if (decor && randomBool(.50)) {
                    decor.kind = (y < GAME_HEIGHT / 2 && randomBool(.50))
                        ? BuildingDecorKind.Block
                        : BuildingDecorKind.Aerials;
                    decor.setPosition(x, y).setRandomFrame();
                }
            } else if (decor && randomBool(.60)) {
                decor.kind = BuildingDecorKind.Wires;
                decor.setPosition(x, y - 64).setRandomFrame();
            }
        }

        // respawn collectables
        if (y < GAME_HEIGHT * 0.8) {
            const typeToSpawn = Collectable.randomKind;
            const amountToSpawn = typeToSpawn == CollectableKind.Life || typeToSpawn == CollectableKind.Bean
                ? 1 // life is only spawned as 1
                : randomInt(1, 4); // 1, 2, or 3

            const collectablesToRespawn = this.collectables
                .getChildren()
                .filter(c => !c.active)
                .slice(0, amountToSpawn) as Collectable[];

            if (collectablesToRespawn.length) {
                // TODO: move logic into Collectable class, and define spawn based on type
                const offsets = {
                    1: [[24, -8]],
                    2: [[16, -8], [32, -8]],
                    3: [[16, -8], [32, -8], [24, -16]],
                }[collectablesToRespawn.length];

                const height = {
                    [CollectableKind.Bean]: 16,
                    [CollectableKind.Life]: 32,
                }[typeToSpawn] || 0;

                collectablesToRespawn.forEach((c, i) => c.respawn(
                    x + offsets[i][0],
                    y + offsets[i][1] - height,
                    typeToSpawn,
                ));
            }
        }
    }


    private handleSpeedChange() {
        this.speedBonus -= this.params.speedBonusTick;
        if (this.speedBonus < 0) this.speedBonus = 0;
        if (this.speedBonus > this.params.speedBonusMax) {
            this.speedBonus = this.params.speedBonusMax;
        }

        if (this.speedBonusMax < this.speedBonus) {
            this.speedBonusMax = this.speedBonus;
        }
    }

    private handleCollect(obj: any) {
        const collectable = obj as Collectable;

        switch (collectable.currentKind) {
            case CollectableKind.Panacat: {
                this.pointsCollected++;

                const [nextMilestone] = this.pointMilestones;
                if (this.pointsCollected >= nextMilestone) {
                    this.player.meow();
                    this.pointMilestones.shift();
                }

                if (this.pointsCollected >= this.params.targetPoints) {
                    this.win();
                }
                break;
            }
            case CollectableKind.Bean: {
                this.speedBonus += this.params.speedBonus;
                break;
            }
            case CollectableKind.Life: {
                this.lifesLeft++;
                break;
            }
        }

        collectable.collect();
    }

    private handleUiText() {
        this.textPanacats.setTextArgs(this.pointsCollected);
        this.textCaffeine.setTextArgs(strings.chars.caffeine.repeat(Math.round(this.speedBonus / this.params.speedBonus)));
        this.textLifes.setTextArgs(strings.chars.life.repeat(this.lifesLeft));
    }

    private lose() {
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
        this.textMain.setTint(0xffffff);
        this.showMainText("3", () => {
            this.showMainText("2", () => {
                this.showMainText("1", () => {
                    this.textMain.setTint(0x88ff44);
                    this.isRunning = true;
                    this.showMainText("GO");
                });
            });
        });
    }

    // TODO: refactor, dont like one-shot approach
    private showMainText(text: string, callback?: () => void) {
        const duration = DEBUG.fastRespawn ? 33 : 333;
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

    private handleActionKey(isDown: boolean) {
        this.isJumping = isDown;
    }

    // TODO: doesnt, works - pauses own unpause event
    // create overlay scene with ui and pause options
    // or even have GameScene - as global overlay
    private handlePauseKey() {
        const { key } = this.scene;
        if (this.scene.isSleeping(key)) {
            this.scene.wake(key);
        } else {
            this.scene.pause(key);
        }
    }

    startOver(message: string, finished: boolean) {
        this.scene.start(SceneKey.Over, {
            message,
            finished,
            points: this.pointsCollected,
            distance: +this.cameras.main.scrollX.toFixed(0),
            maxSpeedMod: +this.speedBonusMax.toFixed(0),
        } as OverSceneParams);
    }
}
