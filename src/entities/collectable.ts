import { EntityKey, EntityAnimation } from "../shared/keys";
import { PhysEntity } from "../shared/factories";
import { random, randomInt, snap } from "../shared/utils";
import { GAME_WIDTH } from "../shared/constants";
import { SPAWN_RATES } from "../shared/settings";

export enum CollectableType {
    Panacat,
    Bean
}

const TINTS = {
    [CollectableType.Panacat]: [0xffeedd, 0xffddcc, 0xffccbb, 0xffbbaa, 0xffaa99],
    [CollectableType.Bean]: [0x884422, 0x995533, 0x663311],
}

const ANIMATIONS = {
    [CollectableType.Panacat]: [EntityAnimation.CollectablePanacatIdle, null],
    [CollectableType.Bean]: [EntityAnimation.CollectableBeanIdle, null],
}

export class Collectable extends PhysEntity({
    key: EntityKey.Collectables,
    size: [16, 16],
    offset: [0, 0],
    static: true,
}) {
    private static probabilityMap = SPAWN_RATES.COLLECTABLES;
    private static totalProbability = Object
        .values(SPAWN_RATES.COLLECTABLES)
        .reduce((acc, v) => acc += v, 0);

    private collectableType: CollectableType;

    constructor(scene: Phaser.Scene, x: number, y: number, color: number) {
        super(scene);
        this.setPosition(x, y)
            .setTint(color)
            .play(EntityAnimation.CollectablePanacatIdle);
        this.body.updateFromGameObject();
    }

    update() {
        const { scrollX } = this.scene.cameras.main;
        if (this.x + 16 < scrollX) {
            this.reset();
        }
    }

    reset() {
        this.collectableType = Collectable.getRandomCollectableType();

        const x = snap(this.x + GAME_WIDTH * 2, this.width);
        const y = randomInt(1, 5) * 16;

        this.setPosition(x, y)
            .setTint(this.getRandomTint())
            .play(this.getAnimationIdle())
        this.body.updateFromGameObject();
    }

    getType() {
        return this.collectableType;
    }

    getRandomTint(): number {
        const tints = TINTS[this.collectableType];
        return tints[randomInt(0, tints.length)];
    }

    getAnimationIdle(): string {
        return ANIMATIONS[this.collectableType][0];
    }

    getAnimationDie(): string {
        return ANIMATIONS[this.collectableType][1];
    }

    static getRandomCollectableType(): CollectableType {
        const rand = random(0, Collectable.totalProbability);

        let cumulativeProbability = 0;

        for (const [key, probability] of Object.entries(Collectable.probabilityMap)) {
            cumulativeProbability += probability;
            if (rand < cumulativeProbability) {
                switch (key) {
                    case 'panacat': return CollectableType.Panacat;
                    case 'bean': return CollectableType.Bean;
                }
            }
        }
        return CollectableType.Panacat;
    }
}
