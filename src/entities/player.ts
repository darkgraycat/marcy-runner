import { EntityKey, EntityAnimation } from "../shared/keys";
import { PhysEntity } from "../shared/factories";

export class Player extends PhysEntity({
    key: EntityKey.Player,
    size: [20, 16],
    offset: [-4, 0],
}) {
    move(velocity: number) {
        this.flipX = velocity < 0;
        this.body.velocity.x = velocity;
        if (this.onGround) {
            this.play(EntityAnimation.PlayerWalk, true)
        }
    }

    idle() {
        this.body.velocity.x = 0;
        if (this.onGround) {
            this.play(EntityAnimation.PlayerIdle, true)
        }
    }

    jump(velocity: number) {
        if (this.onGround) {
            this.body.velocity.y = -velocity;
            this.play(EntityAnimation.PlayerJump, true)
        }
    }

    get onGround() {
        return this.body.touching.down || this.body.blocked.down;
    }
}
