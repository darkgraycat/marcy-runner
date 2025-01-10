import { GAME_HEIGHT, GAME_WIDTH } from "../shared/constants";
import { TilePhysEntity, TileEntity } from "../shared/factories";
import { EntityKey } from "../shared/keys";
import { randomInt, snapToTile } from "../shared/utils";

export class Building extends TilePhysEntity({
    key: EntityKey.Building,
    size: [48, 32],
    offset: [0, 0],
    tilesize: 48,
    static: true,
}) {
    readonly buildingTop: BuildingTop;
    private static lastBuildingSize: number = 0;

    constructor(scene: Phaser.Scene, x: number, height: number, frame: number) {
        super(scene);
        this.setPosition(x, GAME_HEIGHT - Building.tilesize * height)
            .setSize(48, Building.tilesize * height)
            .setFrame(frame)
            .setOrigin(0);

        this.body.checkCollision.down = false;
        this.body.checkCollision.left = false;
        this.body.checkCollision.right = false;

        this.body.updateFromGameObject();

        this.buildingTop = new BuildingTop(scene);
        this.buildingTop.updateByParent(this);
    }

    update(): void {
        const { scrollX } = this.scene.cameras.main;
        if (this.x + Building.tilesize < scrollX) {

            // TODO:
            // 1. Separate Building class - make BuildingGenerator (optional)
            // 2. Fix spawn - sometimes it spawns -0.5 then 3
            //
            // IDEA:
            // Add Base or Trait(Mixin) to have Generatable for Buildings and Collectables

            const floors = Building.lastBuildingSize >= 2 // allow "empty" spawn only after building with 2 blocks
                ? randomInt(0, 3) - 0.5 // chance to spawn empty space
                : randomInt(0, 2) + 0.5

            const randFrame = randomInt(0, 5);
            this.reset(floors, randFrame);
        }
    }

    reset(floors = 1, frame = 0) {
        const [w, h] = Building.config.size;

        if (floors < 0) Building.lastBuildingSize = 0;
        else Building.lastBuildingSize++;

        const height = h * floors;

        const x = snapToTile(this.x + GAME_WIDTH * 2, w);
        const y = GAME_HEIGHT - height;

        // console.log(x, y);
        // console.log('HEIGHT', height);
        // console.log('RESET', `from ${(this.x / 48).toFixed(1)} to ${(x / 48).toFixed(0)}`);

        this.setPosition(x, y)
            .setSize(48, height)
            .setFrame(frame);
        this.body.updateFromGameObject();
        this.buildingTop.updateByParent(this);
        this.buildingTop.setFrame(randomInt(0, 3));
    }
}

class BuildingTop extends TileEntity({
    key: EntityKey.BuildingTop,
    size: [48, 16],
    origin: [0, 0],
    tilesize: 16,
}) {
    updateByParent(building: Building) {
        const { x, y } = building.body;
        this.setPosition(x, y - 16);
        this.setTint(building.tint);
        return this;
    }
}
