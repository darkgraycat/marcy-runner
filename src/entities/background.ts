import { SpriteKey } from "../shared/keys";
import { TileEntity } from "../shared/factories";

export class Background extends TileEntity({
    key: SpriteKey.Backgrounds,
    size: [128, 32],
    origin: [0, 0],
    tilesize: [32, 32],
}) {
    private scrollScale: number;
    private graphics: Phaser.GameObjects.Graphics;

    constructor(scene: Phaser.Scene, frame?: number, offset?: number, scrollScale?: number) {
        super(scene);
        this.setScrollFactor(0)
            .setFrame(frame || 0)
            .setSize(scene.scale.width, Background.config.size[1])
            .placeByTile(0, offset || 0)
        this.scrollScale = scrollScale || 0;
        this.graphics = scene.add.graphics();
        this.graphics.setScrollFactor(0);
    }

    setTint(tint: number): this {
        this.graphics.fillStyle(tint, 1);
        this.graphics.fillRect(
            0,
            this.y + this.height,
            this.scene.scale.width,
            this.scene.scale.height - this.y - this.height,
        );
        return super.setTint(tint)
    }

    placeByTile(col: number, row: number): this {
        const height = this.scene.scale.height / Background.config.size[1] * row
        return super.placeByTile(col, height);
    }

    update() {
        this.tilePositionX = this.scene.cameras.main.scrollX * this.scrollScale;
    }
}
