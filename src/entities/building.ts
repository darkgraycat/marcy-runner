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
    readonly buildingTop: Phaser.GameObjects.Sprite;
    private static lastBuildingSize: number = 0;

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
        const { scrollX } = this.scene.cameras.main;
        if (this.x + Building.tilesize < scrollX) {
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

        const x = snap(this.x + GAME_WIDTH * 2, w);
        const y = GAME_HEIGHT - height;

        this.setPosition(x, y)
            .setSize(48, height)
            .setFrame(frame);
        this.body.updateFromGameObject();
        this.buildingTop.setPosition(this.x, this.y - 16);
        this.buildingTop.setFrame(randomInt(0, 4));
    }
}
