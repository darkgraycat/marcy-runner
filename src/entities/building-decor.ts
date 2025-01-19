import { TileEntity } from "../shared/factories";
import { EntityKey } from "../shared/keys";
import { randomElement } from "../shared/utils";

export enum BuildingDecorKind {
    Aerials,
    Wires,
    Block,
}

const BuildingDecorConfig = {
    [BuildingDecorKind.Wires]: {
        frames: [0],
    },
    [BuildingDecorKind.Aerials]: {
        frames: [1, 2, 3],
    },
    [BuildingDecorKind.Block]: {
        frames: [4, 5],
    },
}

export class BuildingDecor extends TileEntity({
    key: EntityKey.BuildingDecors,
    size: [48, 32],
    tilesize: [48, 16],
}) {
    kind: BuildingDecorKind;

    constructor(scene: Phaser.Scene, col: number, row: number, kind?: BuildingDecorKind) {
        super(scene);
        this.kind = kind || BuildingDecorKind.Aerials;
        this.placeByTile(col, row)
            .setOrigin(0, 1)
            .setRandomFrame();
    }

    setRandomFrame() {
        return this.setFrame(randomElement(BuildingDecorConfig[this.kind].frames));
    }
}
