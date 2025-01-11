import { EntityKey, EntityAnimation } from "../shared/keys";
import { PhysEntity } from "../shared/factories";

export class Player extends PhysEntity({
    key: EntityKey.Player,
    size: [20, 16],
    offset: [-4, 0],
}) {
    walk(velocity: number) {
        this.flipX = velocity < 0;
        this.body.velocity.x = velocity;
        if (this.touchingDown) {
            this.play(EntityAnimation.PlayerWalk, true)
        }
    }

    idle() {
        this.body.velocity.x = 0;
        if (this.touchingDown) {
            this.play(EntityAnimation.PlayerIdle, true)
        }
    }

    jump(velocity: number) {
        if (this.touchingDown) {
            this.body.velocity.y = -velocity;
            this.play(EntityAnimation.PlayerJump, true)
        }
    }

    get touchingDown() {
        return this.body.touching.down || this.body.blocked.down;
    }
}
