import { TileEntity, TilePhysEntity } from "../shared/factories";
import { SpriteKey, EventKey } from "../shared/keys";
import { iterate, randomBool, randomElement, randomInt } from "../shared/utils";

class BuildingRoof extends TileEntity({
    key: SpriteKey.BuildingRoofs,
    size: [48, 16],
    origin: [0, 1],
    tilesize: [48, 32],
}) { }

class BuildingDecor extends TileEntity({
    key: SpriteKey.BuildingDecors,
    size: [48, 32],
    origin: [0, 1],
    tilesize: [48, 32],
}) { }

class InternalBody extends TilePhysEntity({
    key: "",
    size: [48, 32],
    tilesize: [48, 32],
    static: true,
}) {
    constructor(scene: Phaser.Scene) {
        super(scene);
        this.body.checkCollision.down = false;
        this.body.checkCollision.left = false;
        this.body.checkCollision.right = false;
        this.setOrigin(0, 0)
            .setAlpha(0);
    }
}

export class Building extends TilePhysEntity({
    key: SpriteKey.Buildings,
    size: [48, 32],
    tilesize: [48, 32],
    static: true,
}) {
    private roof: BuildingRoof;
    private decor: BuildingDecor;
    private bodies: InternalBody[];

    constructor(scene: Phaser.Scene, col: number = 0, row: number = 0) {
        super(scene);
        console.log(`Building ${col}${row} start -------- ` + (performance.now() / 1000).toFixed(2))
        this.roof = new BuildingRoof(scene);
        console.log(`Building ${col}${row} roof - ` + (performance.now() / 1000).toFixed(2))
        this.decor = new BuildingDecor(scene);
        console.log(`Building ${col}${row} decor - ` + (performance.now() / 1000).toFixed(2))
        this.placeByTile(col, row)
            .resizeByTile(1, row)
            .setOrigin(0, 0);
        console.log(`Building ${col}${row} setup - ` + (performance.now() / 1000).toFixed(2))
        this.body.checkCollision.down = false;
        this.body.checkCollision.left = false;
        this.body.checkCollision.right = false;
        console.log(`Building ${col}${row} setup 2 - ` + (performance.now() / 1000).toFixed(2))

        // this.bodies = iterate(5, () => new InternalBody(scene));
        // this.bodies = [];
        // setTimeout(() => {
        //     iterate(4, () => {
        //         this.bodies.push(new InternalBody(scene));
        //     });
        //     this.updateBody();
        // }, 0);

        console.log(`Building ${col}${row} add bodies - ` + (performance.now() / 1000).toFixed(2))

        this.updateBody();

        console.log(`Building ${col}${row} end - ` + (performance.now() / 1000).toFixed(2))
    }

    respawn(col: number, row: number): void {
        this.scene.events.emit(EventKey.BuildingSpawned, [this.x, this.y]);
        this.placeByTile(col, row)
            .resizeByTile(1, row)
            .setActive(true)
            .randomize()
            .updateBody();
    }

    randomize(): this {
        if (randomBool(0.6)) { // place decor
            this.decor.setVisible(true);
            if (this.y < this.scene.scale.height) {
                this.decor.setFrame(randomElement(this.y <= 48 && randomBool(0.6)
                    ? [5, 6] // towers
                    : [2, 3, 4] // aerials
                ));
            } else {
                this.decor.setFrame(randomElement(
                    [0, 1] // wires
                ));
                this.decor.y = this.scene.scale.height - 16;
            }
        } else {
            this.decor.setVisible(false);
        }
        this.roof.setFrame(randomInt(0, 4));
        return this.setFrame(randomInt(0, 6))
    }

    getInternalBodies(): InternalBody[] {
        return this.bodies;
    }

    setTint(tint: number): this {
        this.roof.setTint(tint);
        this.decor.setTint(Phaser.Display.Color.IntegerToColor(tint).darken(10).color);
        return super.setTint(tint);
    }

    placeByTile(col: number, row: number): this {
        const height = this.scene.scale.height / Building.config.tilesize[1] - row;
        this.roof.placeByTile(col, height);
        this.decor.placeByTile(col, height);
        return super.placeByTile(col, height);
    }

    update(): void {
        const [tileWidth] = Building.config.tilesize;
        if (this.x + tileWidth < this.scene.cameras.main.scrollX) {
            this.setActive(false);
        }
    }

    updateBody(): this {
        // this.bodies.forEach((body, i) => body
        //     .setPosition(this.x, this.y + i * Building.config.tilesize[1])
        //     .updateBody(),
        // );
        return super.updateBody();
    }
}

