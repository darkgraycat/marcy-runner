import { GAME_HEIGHT, GAME_WIDTH } from "../shared/constants";
import { TilePhysEntity } from "../shared/factories";
import { EntityKey, EventKey } from "../shared/keys";
import { randomInt } from "../shared/utils";

export class Building extends TilePhysEntity({
    key: EntityKey.Buildings,
    size: [48, 32],
    offset: [0, 0],
    tilesize: [48, 32],
    static: true,
}) {
    private static lastWidth: number = 0;
    private static lastHeight: number = 0;

    constructor(scene: Phaser.Scene, col: number, row: number, frame?: number) {
        super(scene);
        this.placeByTile(col, row)
            .resizeByTile(1, row)
            .setFrame(frame | 0)
            .setOrigin(0);
        this.body.checkCollision.down = false;
        this.body.checkCollision.left = false;
        this.body.checkCollision.right = false;
        this.updateBody();
    }

    placeByTile(col: number, row: number): this {
        const lastIndex = GAME_HEIGHT / Building.config.tilesize[1]
        return super.placeByTile(col, lastIndex - row);
    }

    update(): void {
        const [tileWidth] = Building.config.tilesize;
        if (this.x + tileWidth < this.scene.cameras.main.scrollX) {
            this.respawn();
        }
    }

    respawn() {
        const maxBuildingWidth = randomInt(2, 8);
        if (Building.lastWidth >= maxBuildingWidth)
            Building.lastWidth = 0;
        else Building.lastWidth++;

        const height = Building.lastWidth > 0
            ? randomInt(
                Math.max(Building.lastHeight - 1, 1),
                Math.min(Building.lastHeight + 2, 4),
            )
            : -1; // empty space

        Building.lastHeight = height;

        const [tileWidth] = Building.config.tilesize;
        const col = (GAME_WIDTH * 2 + this.x) / tileWidth | 0;
        this.placeByTile(col, height - 0.5) // to make it appear half
            .setRandomFrame()
            .resizeByTile(1, height)
            .updateBody();
        this.scene.events.emit(EventKey.BuildingSpawned, [this.x, this.y]);
    }

    setRandomFrame() {
        return this.setFrame(randomInt(0, 6))
    }
}
