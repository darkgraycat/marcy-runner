import { EntityKey } from "../shared/keys";
import { TileEntity } from "../shared/factories";
import { GAME_HEIGHT, GAME_WIDTH } from "../shared/constants";

export class Background extends TileEntity({
    key: EntityKey.Backgrounds,
    size: [GAME_WIDTH, 32],
    origin: [0, 0],
    tilesize: [32, 32],
}) {
    private scrollScale: number;
    private graphics: Phaser.GameObjects.Graphics;

    constructor(scene: Phaser.Scene, frame: number, offset: number, scrollScale: number) {
        super(scene);
        this.setScrollFactor(0)
            .setFrame(frame)
            .placeByTile(0, offset)
        this.scrollScale = scrollScale;
        this.graphics = scene.add.graphics();
        this.graphics.setScrollFactor(0);
    }

    setTint(tint: number): this {
        this.graphics.fillStyle(tint, 1);
        this.graphics.fillRect(0, this.y + this.height, GAME_WIDTH, GAME_HEIGHT - this.y - this.height);
        return super.setTint(tint)
    }

    update() {
        this.tilePositionX = this.scene.cameras.main.scrollX * this.scrollScale;
    }
}
