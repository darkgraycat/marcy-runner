import { PhysEntity } from "../shared/factories";
import { AnimationKey, SpriteKey } from "../shared/keys";
import { GAMEPLAY } from "../shared/settings";
import { randomInt } from "../shared/utils";

export class EnemyDrone extends PhysEntity({
    key: SpriteKey.EnemyDrone,
    size: [28, 16],
    offset: [2, 0],
}) {
    constructor(scene: Phaser.Scene) {
        super(scene);
        this.body.checkCollision.left = false;
        this.body.checkCollision.right = false;
        this.body.checkCollision.down = false;
        this.anims.play(AnimationKey.EnemyDroneFly);
        this.setGravityY(-GAMEPLAY.gravity)
    }

    update(): void {
        const [width] = EnemyDrone.config.size;
        if (this.x + width < this.scene.cameras.main.scrollX) {
            this.setActive(false)
        }
    }

    die() {
        this.disableBody();
        this.anims.play(AnimationKey.EnemyDroneDie);
        this.scene.time.delayedCall(200, () => {
            this.setActive(false).setVisible(false);
        });
    }

    respawn(x: number, y: number) {
        return this
            .setActive(true)
            .setVisible(true)
            .setPosition(x, y)
            .enableBody()
            .updateBody()
            .setVelocity(-randomInt(GAMEPLAY.enemyDroneVelocity / 2, GAMEPLAY.enemyDroneVelocity), 0)
            .anims.play(AnimationKey.EnemyDroneFly);
    }
}
