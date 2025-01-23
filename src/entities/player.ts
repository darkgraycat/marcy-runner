import { EntityKey, AnimationKey, AudioKey } from "../shared/keys";
import { PhysEntity } from "../shared/factories";
import { GAMEPLAY, SETTINGS } from "../shared/settings";

export class Player extends PhysEntity({
    key: EntityKey.Player,
    size: [24, 12],
    offset: [-8, 4],
}) {
    private soundJump: Phaser.Sound.BaseSound;
    private soundMeow: Phaser.Sound.BaseSound;

    constructor(scene: Phaser.Scene) {
        super(scene);
        this.soundJump = scene.sound.add(AudioKey.Jump, { volume: SETTINGS.volumeEffects * 0.1 });
        this.soundMeow = scene.sound.add(AudioKey.Meow, { volume: SETTINGS.volumeEffects * 0.2 });
    }

    move(velocity: number) {
        this.flipX = velocity < 0;
        this.body.velocity.x = velocity;
        if (this.onGround) {
            this.anims.play(velocity > GAMEPLAY.initialMoveVelocity
                ? AnimationKey.PlayerRun
                : AnimationKey.PlayerWalk, true)
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
            this.anims.play(AnimationKey.PlayerJump, true)
            this.soundJump.play({ detune: -400 });
        }
    }

    meow(level: number = 0) {
        this.soundMeow.play({ detune: level * 100 });
    }

    get onGround() {
        return this.body.blocked.down;
    }
}
