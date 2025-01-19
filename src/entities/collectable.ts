import { EntityKey, AnimationKey } from "../shared/keys";
import { PhysEntity } from "../shared/factories";
import { randomByProbability, randomElement } from "../shared/utils";
import { SPAWN_RATES } from "../shared/settings";

export enum CollectableKind {
    Panacat,
    Bean,
    Life,
}

const CollectableConfig = {
    [CollectableKind.Panacat]: {
        tints: [0xff9e70, 0xffdf5f, 0xff8195, 0x7a4841, 0x602c2c],
        animations: [AnimationKey.CollectablePanacatIdle, AnimationKey.CollectablePanacatDie],
    },
    [CollectableKind.Bean]: {
        tints: [0xbd7856, 0xc5764f, 0x824923],
        animations: [AnimationKey.CollectableBeanIdle, AnimationKey.CollectableBeanDie],
    },
    [CollectableKind.Life]: {
        tints: [0xff593a],
        animations: [AnimationKey.CollectableLifeIdle, AnimationKey.CollectableLifeDie],
    },
}

export class Collectable extends PhysEntity({
    key: EntityKey.Collectables,
    size: [16, 16],
    offset: [0, 0],
    static: true,
}) {
    static readonly probabilityMap = SPAWN_RATES.COLLECTABLES;

    kind: CollectableKind;

    constructor(scene: Phaser.Scene, x: number, y: number, kind?: CollectableKind) {
        super(scene);
        this.kind = kind || CollectableKind.Panacat;
        this.setPosition(x, y);
        this.updateBody();
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

    respawn(x: number, y: number, kind: CollectableKind) {
        this.kind = kind;
        return this.setActive(true).setVisible(true).enableBody()
            .setPosition(x, y)
            .updateBody()
            .setTint(this.randomTint)
            .play(this.animation.idle)
    }

    get currentKind() {
        return this.kind;
    }

    get animation() {
        const [idle, die] = CollectableConfig[this.kind].animations;
        return { idle, die };
    }

    get randomTint(): number {
        return randomElement(CollectableConfig[this.kind].tints);
    }

    static get randomKind(): CollectableKind {
        const key = randomByProbability(Collectable.probabilityMap);
        switch (key) {
            case 'panacat': return CollectableKind.Panacat;
            case 'bean': return CollectableKind.Bean;
            case 'life': return CollectableKind.Life;
        }
        return CollectableKind.Panacat;
    }
}
