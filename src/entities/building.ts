import { GAME_HEIGHT } from "../shared/constants";
import { TileEntity, TilePhysEntity } from "../shared/factories";
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

export class Building extends TilePhysEntity({
    key: SpriteKey.Buildings,
    size: [48, 32],
    offset: [0, 0],
    tilesize: [48, 32],
    static: true,
}) {
    private roof: BuildingRoof;
    private decor: BuildingDecor;

    constructor(scene: Phaser.Scene, col: number = 0, row: number = 0) {
        super(scene);
        this.roof = new BuildingRoof(scene);
        this.decor = new BuildingDecor(scene);
        this.placeByTile(col, row)
            .resizeByTile(1, row)
            .setOrigin(0);
        this.body.checkCollision.down = false;
        this.body.checkCollision.left = false;
        this.body.checkCollision.right = false;
        this.updateBody();
    }

    setTint(tint: number): this {
        this.roof.setTint(tint);
        this.decor.setTint(Phaser.Display.Color.IntegerToColor(tint).darken(10).color);
        return super.setTint(tint);
    }

    placeByTile(col: number, row: number): this {
        const height = GAME_HEIGHT / Building.config.tilesize[1] - row;
        this.roof.placeByTile(col, height);
        this.decor.placeByTile(col, height);
        return super.placeByTile(col, height);
    }

    randomize() {
        if (randomBool(0.6)) { // place decor
            this.decor.setVisible(true);
            if (this.y < GAME_HEIGHT) {
                this.decor.setFrame(randomElement(this.y <= 48 && randomBool(0.6)
                    ? [5, 6] // towers
                    : [2, 3, 4] // aerials
                ));
            } else {
                this.decor.setFrame(randomElement(
                    [0, 1] // wires
                ));
                this.decor.y = GAME_HEIGHT - 16;
            }
        } else {
            this.decor.setVisible(false);
        }
        this.roof.setFrame(randomInt(0, 4));
        return this.setFrame(randomInt(0, 6))
    }

    update(): void {
        const [tileWidth] = Building.config.tilesize;
        if (this.x + tileWidth < this.scene.cameras.main.scrollX) {
            this.setActive(false);
        }
    }

    respawn(col: number, row: number) {
        this.scene.events.emit(EventKey.BuildingSpawned, [this.x, this.y]);
        this.placeByTile(col, row)
            .resizeByTile(1, row)
            .setActive(true)
            .randomize()
            .updateBody();
    }
}

