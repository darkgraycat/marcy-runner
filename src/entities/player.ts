import { EntityKey, AnimationKey } from "../shared/keys";
import { PhysEntity } from "../shared/factories";

export class Player extends PhysEntity({
    key: EntityKey.Player,
    size: [24, 12],
    offset: [-8, 4],
}) {
    move(velocity: number) {
        this.flipX = velocity < 0;
        this.body.velocity.x = velocity;
        if (this.onGround) {
            this.play(AnimationKey.PlayerWalk, true)
        }
    }

    idle() {
        this.body.velocity.x = 0;
        if (this.onGround) {
            this.play(AnimationKey.PlayerIdle, true)
        }
    }

    jump(velocity: number) {
        if (this.onGround) {
            this.body.velocity.y = -velocity;
            this.play(AnimationKey.PlayerJump, true)
        }
    }

    get onGround() {
        return this.body.blocked.down;
    }
}
