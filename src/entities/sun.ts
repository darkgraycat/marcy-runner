export class Sun extends Phaser.GameObjects.Graphics {
    private radius: number;
    private xpos: number;
    private ypos: number;

    constructor(scene: Phaser.Scene, x: number, y: number, radius: number) {
        super(scene);
        this.fillStyle(0xffffff, 1);
        this.fillCircle(x, y, radius);
        this.radius = radius;
        this.xpos = x;
        this.ypos = y;
        this.setScrollFactor(0);
        scene.add.existing(this);
    }

    setTint(color: number | string) {
        this.fillStyle(+color, 1);
        this.fillCircle(this.xpos, this.ypos, this.radius);
        return this;
    }
}
