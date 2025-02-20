import { SpriteKey, AnimationKey, AudioKey } from "../shared/keys";
import { PhysEntity } from "../shared/factories";
import { randomByProbability, randomElement } from "../shared/utils";
import { SETTINGS, SPAWN_RATES } from "../shared/settings";

export enum CollectableKind {
    Panacat,
    Bean,
    Life,
}

// TODO: move to /data
const CollectableConfig: Record<string, {
    tints: number[],
    animations: string[],
    sound: [string, number, number],
}> = {
    [CollectableKind.Panacat]: {
        tints: [0xff9e70, 0xffdf5f, 0xff8195, 0x7a4841, 0x602c2c],
        animations: [AnimationKey.CollectablePanacatIdle, AnimationKey.CollectablePanacatDie],
        sound: [AudioKey.Collect, 0.3, 400],
    },
    [CollectableKind.Bean]: {
        tints: [0xbd7856, 0xc5764f, 0x824923],
        animations: [AnimationKey.CollectableBeanIdle, AnimationKey.CollectableBeanDie],
        sound: [AudioKey.Warp, 0.3, -200],
    },
    [CollectableKind.Life]: {
        tints: [0xff593a],
        animations: [AnimationKey.CollectableLifeIdle, AnimationKey.CollectableLifeDie],
        sound: [AudioKey.Meow, 0.2, 300],
    },
};

export class Collectable extends PhysEntity({
    key: SpriteKey.Collectables,
    size: [16, 16],
    offset: [0, 0],
    static: true,
}) {
    static readonly probabilityMap = SPAWN_RATES.COLLECTABLES;

    private kind: CollectableKind;

    constructor(scene: Phaser.Scene, kind?: CollectableKind) {
        super(scene);
        this.kind = kind || CollectableKind.Panacat;
        this.updateBody();
    }

    update() {
        if (this.x + 16 < this.scene.cameras.main.scrollX) {
            this.setActive(false).setVisible(false).disableBody();
        }
    }

    collect() {
        this.disableBody();
        this.scene.sound.play(this.sound.key, this.sound.config);
        if (this.animation.die) {
            this.anims.play(this.animation.die);
            this.scene.time.delayedCall(200, () => {
                this.setActive(false).setVisible(false);
            });
        } else {
            this.setActive(false).setVisible(false);
        }
    }

    respawn(x: number, y: number, kind?: CollectableKind) {
        this.kind = kind || CollectableKind.Panacat;
        return this
            .setActive(true)
            .setVisible(true)
            .enableBody()
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

    get sound() {
        const [key, volume, detune] = CollectableConfig[this.kind].sound;
        return { key, config: { volume: SETTINGS.volumeEffects * volume, detune: detune } };
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
