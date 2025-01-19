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
        frames: [0, 1],
    },
    [BuildingDecorKind.Aerials]: {
        frames: [2, 3, 4],
    },
    [BuildingDecorKind.Block]: {
        frames: [5, 6],
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
