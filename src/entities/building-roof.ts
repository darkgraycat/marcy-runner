import { TileEntity } from "../shared/factories";
import { EntityKey } from "../shared/keys";
import { randomInt } from "../shared/utils";

export class BuildingRoof extends TileEntity({
    key: EntityKey.BuildingRoofs,
    size: [48, 16],
    tilesize: [48, 16],
}) {
    constructor(scene: Phaser.Scene, col: number, row: number) {
        super(scene);
        this.placeByTile(col, row)
            .setOrigin(0, 1);
    }

    setRandomFrame() {
        return this.setFrame(randomInt(0, 4))
    }
}

