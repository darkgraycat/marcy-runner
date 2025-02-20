import { GroupEntity, TileEntity, TilePhysEntity } from "../shared/factories";
import { SpriteKey, EventKey } from "../shared/keys";
import { randomBool, randomElement, randomInt } from "../shared/utils";

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
            .setAlpha(0.0);
    }
}

class InternalBodyGroup extends GroupEntity({
    class: InternalBody,
    update: false,
    capacity: 4,
}) {}

export class Building extends TilePhysEntity({
    key: SpriteKey.Buildings,
    size: [48, 32],
    tilesize: [48, 32],
    static: true,
}) {
    private roof: BuildingRoof;
    private decor: BuildingDecor;
    private internalBodies: InternalBodyGroup;

    constructor(scene: Phaser.Scene, col?: number, row?: number) {
        super(scene);
        this.roof = new BuildingRoof(scene);
        this.decor = new BuildingDecor(scene);
        this.placeByTile(col || 0, row || 0)
            .resizeByTile(1, row)
            .setOrigin(0, 0);
        this.body.checkCollision.down = false;
        this.body.checkCollision.left = false;
        this.body.checkCollision.right = false;

        this.internalBodies = new InternalBodyGroup(scene, [
            new InternalBody(scene),
            new InternalBody(scene),
            new InternalBody(scene),
            new InternalBody(scene),
        ]);

        this.updateBody();
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

    getInternalBodies() {
        return this.internalBodies.getEntities();
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
        this.internalBodies.setXY(this.x, this.y);
        this.internalBodies.incY(0, Building.config.tilesize[1]);
        this.internalBodies.getEntities().forEach(ib => ib.updateBody());
        return super.updateBody();
    }
}

