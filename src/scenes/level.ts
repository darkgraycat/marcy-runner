import levels from "../data/levels";
import strings from "../data/strings";
import { Background } from "../entities/background";
import { Collectable, CollectableKind } from "../entities/collectable";
import { Player } from "../entities/player";
import { Sun } from "../entities/sun";
import { UiText } from "../entities/ui";
import { Controller, Scene } from "../shared/factories";
import { EventKey, SceneKey } from "../shared/keys";
import { iterate, randomInt } from "../shared/utils";
import { OverSceneParams } from "./over";
import { DEBUG, GAMEPLAY } from "../shared/settings";
import { Building } from "../entities/building";
import { blockHeightGenerator } from "../shared/generators";

const defaults = {
    moveVelocity: GAMEPLAY.initialMoveVelocity,
    jumpVelocity: GAMEPLAY.initialJumpVelocity,
    initialLifes: GAMEPLAY.initialLifes,
    targetPoints: GAMEPLAY.targetPoints,
    speedBonus: GAMEPLAY.speedBonus,
    speedBonusMax: GAMEPLAY.speedBonusMax,
    speedBonusTick: GAMEPLAY.speedBonusTick,
    levelIdx: 0,
};

class LevelController extends Controller({
    keyJump: 'SPACE'
}) {}

export type LevelSceneParams = typeof defaults;

export class LevelScene extends Scene<LevelSceneParams>(SceneKey.Level, defaults) {
    private player: Player;
    private sun: Sun;
    private backgrounds: Phaser.GameObjects.Group;
    private buildings: Phaser.GameObjects.Group;
    private collectables: Phaser.GameObjects.Group;

    private blockGenerator: Generator<number, number, number>;
    private controller: LevelController;

    private isJumping: boolean;
    private isJumpInProgress: boolean;

    private isRunning: boolean;
    private speedBonus: number;
    private speedBonusMax: number;

    private pointsCollected: number;
    private pointMilestones: number[];
    private lifesLeft: number;

    private textPanacats: UiText;
    private textCaffeine: UiText;
    private textLifes: UiText;
    private textMain: UiText;

    create() {
        super.create();
        this.isJumping = false;
        this.isJumpInProgress = false;
        this.isRunning = false;
        this.speedBonus = 0;
        this.speedBonusMax = 0;
        this.lifesLeft = this.params.initialLifes;

        this.pointsCollected = 0;
        this.pointMilestones = [
            this.params.targetPoints * 0.25 | 0, // 25%
            this.params.targetPoints * 0.50 | 0, // 50%
            this.params.targetPoints * 0.75 | 0, // 75%
        ];

        this.blockGenerator = blockHeightGenerator({
            widthsRange: [3, 9],
            heightsRange: [1, 4],
            decrement: 1,
            increment: 2,
        });

        this.controller = new LevelController(this);

        const { width, height } = this.scale;
        const level = levels[this.params.levelIdx];
        const totalBuildings = Math.round(2 * width / Building.config.tilesize[0]);
        console.log({ totalBuildings })
        const totalCollectables = 12;

        /* #entities */
        this.sun = new Sun(this, width * 0.45, height * 0.25, 6);

        this.backgrounds = this.add.group({ runChildUpdate: true });
        for (const [frame, y, color, scrollScale] of level.backgrounds) {
            this.backgrounds.add(new Background(this, frame, y, scrollScale).setTint(color))
        }

        this.buildings = this.add.group({ runChildUpdate: true });
        iterate(totalBuildings, i =>
            this.buildings.add(new Building(this, i - totalBuildings / 2, 1.5)
                .setTint(level.buildings)
                .randomize()
            )
        );

        this.collectables = this.add.group({ runChildUpdate: true });
        iterate(totalCollectables, i =>
            this.collectables.add(new Collectable(this, -width, 0))
        );

        /* #player */
        this.player = new Player(this).setPosition(this.scale.width / 2, 64);

        /* #controls */
        this.input.keyboard.on('keydown-SPACE', this.onActionDown, this);
        this.input.keyboard.on('keyup-SPACE', this.onActionUp, this);
        this.input.on('pointerdown', this.onActionDown, this);
        this.input.on('pointerup', this.onActionUp, this);

        /* #physics */
        this.physics.add.collider(this.buildings, this.player);
        this.physics.add.overlap(this.collectables, this.player, this.handleCollect, null, this);

        /* #ui */
        this.textLifes = new UiText(this, strings.gameScene.lifesLeft)
            .setRelativePosition(0.0, 0.0, 4, 4)
            .setOrigin(0, 0)
            .setDepth(99);
        this.textPanacats = new UiText(this, strings.gameScene.panacatsCollected)
            .setRelativePosition(0.5, 0.0, 0, 4)
            .setOrigin(0.5, 0)
            .setDepth(99);
        this.textCaffeine = new UiText(this, strings.gameScene.caffeine)
            .setRelativePosition(1.0, 0.0, -4, 4)
            .setOrigin(1, 0)
        this.textMain = new UiText(this)
            .setRelativePosition(0.5, 0.5)
            .setDepth(99)
            .setScale(4)
            .setAlpha(0);

        /* other */
        const fadeFromColor = Phaser.Display.Color.IntegerToRGB(level.sky);
        this.cameras.main.fadeFrom(500, fadeFromColor.r, fadeFromColor.g, fadeFromColor.b);
        this.cameras.main.setBounds(0, 0, Number.MAX_SAFE_INTEGER, height);
        // TODO: cleanup
        // this.cameras.main.startFollow(this.player, false, 1, 0, -width * 0.3, 0);
        this.cameras.main.startFollow(this.player, false, 1, 0, -320 * 0.3, 0);
        this.cameras.main.setBackgroundColor(level.sky);

        this.game.events.on(EventKey.ScreenResized, this.onScreenResized, this);

        this.handlePlayerRespawn();
    }

    update(time: number, delta: number) {
        this.handlePlayer(delta);
        this.handleSpeedChange();
        this.handleUiText();
        // TODO: separate from collectables
        this.handleBuildingRespawn();
    }


    private handlePlayer(delta: number) {
        const { moveVelocity, jumpVelocity } = this.params;

        if (this.isRunning) {
            this.player.move(moveVelocity + this.speedBonus);
        } else {
            this.player.idle();
        }

        if (this.isJumping && !this.isJumpInProgress) {
            this.isJumpInProgress = true;
            this.player.jump(jumpVelocity);
        }

        if (!this.isJumping) {
            if (this.player.body.velocity.y < 0)
                this.player.body.velocity.y /= 2;
            if (this.player.body.blocked.down)
                this.isJumpInProgress = false;
        }

        if (this.player.y > this.scale.height * 2 && this.isRunning) {
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
            this.startOver(false);
        }
    }

    private handlePlayerRespawn() {
        const entries = this.buildings.getChildren() as Building[];
        const safeBuilding = entries
            .filter((b) => b.x > this.player.x && b.y < this.scale.height)
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

    private handleBuildingRespawn() {
        const building = this.buildings.getFirstDead() as Building;
        if (!building) return;

        const [tileWidth] = Building.config.tilesize;
        const height = this.blockGenerator.next().value;
        const column = (this.scale.width * 2 + building.x) / tileWidth | 0;
        building.respawn(column, height - 0.5);

        // respawn collectables
        if (building.y < this.scale.height * 0.8) {
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
                    building.x + offsets[i][0],
                    building.y + offsets[i][1] - height,
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
                    this.startOver(true);
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

    private onActionDown() {
        this.isJumping = true;
    }

    private onActionUp() {
        this.isJumping = false;
    }

    private onScreenResized() {
        this.textLifes.updateRelativePosition();
        this.textMain.updateRelativePosition();
        this.textPanacats.updateRelativePosition();
        this.textCaffeine.updateRelativePosition();
    }

    startOver(finished: boolean) {
        const overParams: Partial<OverSceneParams> = {
            finished,
            points: this.pointsCollected,
            targetPoints: this.params.targetPoints,
            distance: +this.cameras.main.scrollX.toFixed(0),
            maxSpeedMod: +this.speedBonusMax.toFixed(0),
            levelIdx: this.params.levelIdx,
        };
        this.game.events.emit(EventKey.OverStarted, overParams);
    }
}
