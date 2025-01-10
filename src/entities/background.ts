import { EntityKey } from "../shared/keys";
import { TileEntity } from "../shared/factories";
import { GAME_WIDTH } from "../shared/constants";

export class Background extends TileEntity({
    key: EntityKey.Background,
    size: [GAME_WIDTH, 32],
    origin: [0, 0],
    tilesize: 32,
}) {
    speed: number;

    constructor(scene: Phaser.Scene, position: number, frame: number, speed: number) {
        super(scene);
        this.setPosition(0, Background.tilesize * position)
            .setFrame(frame)
            .setScrollFactor(0);
        this.speed = speed;
    }

    update() {
        this.tilePositionX += this.speed;
    }
}
