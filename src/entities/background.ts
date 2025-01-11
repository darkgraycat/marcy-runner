import { EntityKey } from "../shared/keys";
import { TileEntity } from "../shared/factories";
import { GAME_WIDTH } from "../shared/constants";

export class Background extends TileEntity({
    key: EntityKey.Background,
    size: [GAME_WIDTH, 32],
    origin: [0, 0],
    tilesize: 32,
}) {
    scrollScale: number;
    autoScroll: boolean;

    constructor(scene: Phaser.Scene, position: number, frame: number, scrollScale: number, autoScroll: boolean = false) {
        super(scene);
        this.setPosition(0, Background.tilesize * position)
            .setFrame(frame)
            .setScrollFactor(0);
        this.scrollScale = scrollScale;
        this.autoScroll = autoScroll;
    }

    update() {
        if (this.autoScroll) {
            this.tilePositionX += this.scrollScale;
        } else {
            this.tilePositionX = this.scene.cameras.main.scrollX * this.scrollScale;
        }
    }
}
