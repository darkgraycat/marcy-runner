import { GAME_HEIGHT, GAME_WIDTH } from "../shared/constants";
import { TilePhysEntity } from "../shared/factories";
import { blockHeightGenerator } from "../shared/generators";
import { EntityKey, EventKey } from "../shared/keys";
import { randomInt } from "../shared/utils";

const generator = blockHeightGenerator({
    widthsRange: [2, 8],
    heightsRange: [1, 4],
    decrement: 1,
    increment: 2,
});

export class Building extends TilePhysEntity({
    key: EntityKey.Buildings,
    size: [48, 32],
    offset: [0, 0],
    tilesize: [48, 32],
    static: true,
}) {
    constructor(scene: Phaser.Scene, col: number = 0, row: number = 0) {
        super(scene);
        this.placeByTile(col, row)
            .resizeByTile(1, row)
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
        const height = generator.next().value;

        const [tileWidth] = Building.config.tilesize;
        const col = (GAME_WIDTH * 2 + this.x) / tileWidth | 0; // place at the same point but GAME_WIDTH*2
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
