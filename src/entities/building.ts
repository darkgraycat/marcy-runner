import { GAME_HEIGHT, GAME_WIDTH } from "../shared/constants";
import { TilePhysEntity } from "../shared/factories";
import { EntityKey } from "../shared/keys";
import { randomInt, snap } from "../shared/utils";

export class Building extends TilePhysEntity({
    key: EntityKey.Buildings,
    size: [48, 32],
    offset: [0, 0],
    tilesize: 48,
    static: true,
}) {
    static readonly EventSpawned = 'events_building_spawned';

    private static lastBuildingWidth: number = 0;
    private static lastBuildingHeight: number = 0;

    private buildingTop: Phaser.GameObjects.Sprite;

    constructor(scene: Phaser.Scene, x: number, y: number, frame: number) {
        super(scene);
        this.setPosition(x, GAME_HEIGHT - y)
            .setSize(48, y)
            .setFrame(frame)
            .setOrigin(0);

        this.body.checkCollision.down = false;
        this.body.checkCollision.left = false;
        this.body.checkCollision.right = false;

        this.body.updateFromGameObject();

        this.buildingTop = scene.add
            .sprite(this.x, this.y - 16, EntityKey.BuildingTops)
            .setOrigin(0, 0);
    }

    setColor(color: number | string) {
        this.setTint(+color);
        this.buildingTop.setTint(+color);
        return this;
    }

    update(): void {
        if (this.x + Building.tilesize < this.scene.cameras.main.scrollX) {
            const lastFloors = Math.ceil(Building.lastBuildingHeight);
            const maxWidth = randomInt(2, 8);
            let floors = 0;
            if (Building.lastBuildingWidth >= maxWidth) {
                floors = 0;
                Building.lastBuildingWidth = 0;
            } else {
                Building.lastBuildingWidth++;
                floors = randomInt(
                    Math.max(lastFloors - 1, 1),
                    Math.min(lastFloors + 2, 4),
                );
            }

            Building.lastBuildingHeight = floors;
            this.respawn(floors - 0.5); // subtract 0.5 to make sure it invisible in case floors is 0
        }
    }

    respawn(floors = 1, frame = 0) {
        const [w, h] = Building.config.size;
        const height = h * floors;
        const x = snap(this.x + GAME_WIDTH * 2, w);
        const y = GAME_HEIGHT - height;

        this.setPosition(x, y).setSize(48, height).setFrame(frame);
        this.body.updateFromGameObject();
        this.buildingTop.setPosition(this.x, this.y - 16).setFrame(randomInt(0, 4));
        this.scene.events.emit(Building.EventSpawned, [x, y]);
    }
}
