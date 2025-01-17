import { EntityKey, EntityAnimation } from "../shared/keys";
import { PhysEntity } from "../shared/factories";
import { randomByProbability, randomElement } from "../shared/utils";
import { SPAWN_RATES } from "../shared/settings";

export enum CollectableType {
    Panacat,
    Bean,
    Life,
}

const CollectableConfig = {
    [CollectableType.Panacat]: {
        tints: [0xffeedd, 0xffddcc, 0xffccbb, 0xffbbaa, 0xffaa99],
        animations: [EntityAnimation.CollectablePanacatIdle, null],
    },
    [CollectableType.Bean]: {
        tints: [0x884422, 0x995533, 0x663311],
        animations: [EntityAnimation.CollectableBeanIdle, null],
    },
    [CollectableType.Life]: {
        tints: [0xff8833],
        animations: [EntityAnimation.CollectableLifeIdle, EntityAnimation.CollectableLifeDie],
    },
}

export class Collectable extends PhysEntity({
    key: EntityKey.Collectables,
    size: [16, 16],
    offset: [0, 0],
    static: true,
}) {
    private static probabilityMap = SPAWN_RATES.COLLECTABLES;

    private collectableType: CollectableType;

    constructor(scene: Phaser.Scene, x: number, y: number, color: number) {
        super(scene);
        this.setPosition(x, y)
            .setTint(color)
            .play(EntityAnimation.CollectablePanacatIdle);
        this.body.updateFromGameObject();
    }

    update() {
        if (this.x + 16 < this.scene.cameras.main.scrollX) {
            this.setActive(false).setVisible(false).disableBody();
        }
    }

    collect() {
        this.disableBody();
        if (this.animation.die) {
            this.play(this.animation.die);
            setTimeout(() => this.setActive(false).setVisible(false), 200);
        } else {
            this.setActive(false).setVisible(false);
        }
        return this;
    }

    respawn(x: number, y: number, type: CollectableType) {
        this.collectableType = type;
        return this.setActive(true).setVisible(true).enableBody()
            .setPosition(x, y)
            .updateBody()
            .setTint(this.randomTint)
            .play(this.animation.idle)
    }

    getType() {
        return this.collectableType;
    }

    get currentType() {
        return this.collectableType;
    }

    get animation() {
        const [idle, die] = CollectableConfig[this.collectableType].animations;
        return { idle, die };
    }

    get randomTint(): number {
        return randomElement(CollectableConfig[this.collectableType].tints);
    }

    static get randomType(): CollectableType {
        const key = randomByProbability(Collectable.probabilityMap);
        switch (key) {
            case 'panacat': return CollectableType.Panacat;
            case 'bean': return CollectableType.Bean;
            case 'life': return CollectableType.Life;
        }
        return CollectableType.Panacat;
    }
}
