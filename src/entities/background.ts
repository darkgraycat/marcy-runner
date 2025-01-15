import { EntityKey } from "../shared/keys";
import { TileEntity } from "../shared/factories";
import { GAME_HEIGHT, GAME_WIDTH } from "../shared/constants";

export class Background extends TileEntity({
    key: EntityKey.Backgrounds,
    size: [GAME_WIDTH, 32],
    origin: [0, 0],
    tilesize: 32,
}) {
    private scrollScale: number;
    private autoScroll: boolean;
    private graphics: Phaser.GameObjects.Graphics;

    constructor(scene: Phaser.Scene, frame: number, y: number, scrollScale: number, autoScroll: boolean = false) {
        super(scene);
        this.setPosition(0, y)
            .setFrame(frame)
            .setScrollFactor(0);
        this.scrollScale = scrollScale;
        this.autoScroll = autoScroll;
        this.graphics = scene.add.graphics();
        this.graphics.setScrollFactor(0);
    }

    setColor(color: string | number) {
        this.setTint(+color);
        if (!this.autoScroll) {
            this.graphics.fillStyle(+color, 1);
            this.graphics.fillRect(0, this.y + this.height, GAME_WIDTH, GAME_HEIGHT - this.y - this.height);
        }
        return this;
    }

    update() {
        if (this.autoScroll) {
            this.tilePositionX += this.scrollScale;
        } else {
            this.tilePositionX = this.scene.cameras.main.scrollX * this.scrollScale;
        }
    }
}
