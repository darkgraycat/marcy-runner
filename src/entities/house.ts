import { EntityKey } from "../shared/keys";
import { Entity } from "../shared/factories";
import { randomInt } from "../shared/utils";

class H extends Entity({
    key: EntityKey.Building,
    size: [48, 32],
    origin: [.5, 0],
}) { }

export class House extends Phaser.GameObjects.Group {
    constructor(scene: Phaser.Scene, x: number, y: number, size: number) {
        super(scene);
        y = 96 + y;
        for (let t = 0; t < size; t++) {
            this.add(
                new H(scene).setPosition(x, y - 32 * t)
            );
        }

        scene.add.existing(this);
    }

    setFrames(frame: number) {
        this.children.entries.forEach(e => {
            (e as Phaser.GameObjects.Sprite).setFrame(frame);
        });
        return this;
    }

    randomize() {
        const flag = () => randomInt(0, 10) > 2;
        this.children.entries.forEach(e => {
            (e as Phaser.GameObjects.Sprite)
                .setVisible(flag())
                .setFrame(randomInt(0, 3));
        });
        return this;
    }
}
