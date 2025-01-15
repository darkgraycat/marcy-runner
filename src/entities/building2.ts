import { GAME_HEIGHT } from "../shared/constants";
import { GroupEntity, GroupPhysEntity, PhysEntity } from "../shared/factories";
import { EntityKey } from "../shared/keys";

export class BuildingBlock extends PhysEntity({
    key: EntityKey.Buildings,
    size: [48, 32],
    offset: [0, 0],
    static: true,
}) {
    constructor(scene: Phaser.Scene) {
        super(scene)
        this.setOrigin(0);
        this.body.checkCollision.down = false;
        this.body.checkCollision.left = false;
        this.body.checkCollision.right = false;
    }
}

export class Building2 extends GroupEntity({
    class: BuildingBlock as any,
    update: true,
    capacity: 5,
}) {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, [
            // new BuildingBlock(scene).setPosition(x, GAME_HEIGHT - y - 16),
            // new BuildingBlock(scene).setPosition(x, GAME_HEIGHT - y - 48),
            // new BuildingBlock(scene).setPosition(x, GAME_HEIGHT - y - 80),
        ]);

            this.add(new BuildingBlock(scene).setPosition(x, GAME_HEIGHT - y - 16), true);
            this.add(new BuildingBlock(scene).setPosition(x, GAME_HEIGHT - y - 48), true);
            this.add(new BuildingBlock(scene).setPosition(x, GAME_HEIGHT - y - 80), true);

        scene.physics.add.existing(this as any)
    }
}

// export class Building2 extends ContainerEntity({
//     class: BuildingBlock,
// }) {
//     constructor(scene: Phaser.Scene, x: number, y: number) {
//         super(scene, [
//             new Phaser.GameObjects.Sprite(scene, 0, 0, EntityKey.BuildingTops).setOrigin(0),
//             new BuildingBlock(scene).setPosition(0, 16),
//             new BuildingBlock(scene).setPosition(0, 48),
//             new BuildingBlock(scene).setPosition(0, 80),
//         ]);
//         this.setPosition(x, GAME_HEIGHT - y);
//     }
// }


