import { EntityKey } from "../shared/keys";
import { Entity, GroupEntity } from "../shared/factories";
import { GAME_WIDTH } from "../shared/constants";

const frameTintMap = [0x606070, 0x774844, 0x668877, 0xeeddaa];

class ForegroundTile extends Entity({
    key: EntityKey.Foreground,
    size: [48, 32],
    origin: [0, 0],
}) {
    addedSpeed: number = 0;
    setSpeed(speed: number) {
        this.addedSpeed = speed;
        return this;
    }
    update() {
        const { scrollX } = this.scene.cameras.main;
        this.x -= this.addedSpeed;
        if (this.x < scrollX - this.width) {
            this.reset();
        }
    }
    reset() {
        this.x = this.x + GAME_WIDTH * 2;
    }

}

export class Foreground extends GroupEntity({
    class: ForegroundTile,
    update: true,
    capacity: 10,
}) {
    constructor(scene: Phaser.Scene, position: number, speed: number, frames: number[]) {
        const [w, h] = ForegroundTile.config.size;
        const tiles = frames.map((frame, i) => frame >= 1 && // TODO: remove building frame from foregrounds.png
            new ForegroundTile(scene)
                .setFrame(frame)
                .setSpeed(speed)
                .setPosition(i * w, position * h)
                .setTint(frameTintMap[frame])
        ).filter(Boolean);
        super(scene, tiles);
    }
}
