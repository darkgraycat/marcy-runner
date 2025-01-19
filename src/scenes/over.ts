import { FontKey, SceneKey } from "../shared/keys";
import { Scene } from "../shared/factories";
import { Background } from "../entities/background";
import { GAME_HEIGHT, GAME_WIDTH, TILESIZE } from "../shared/constants";
import { DEBUG } from "../shared/settings";

export type OverSceneParams = {
    message: string,
    finished: boolean,
    points: number,
    distance: number,
    maxSpeedMod: number,
}

export class OverScene extends Scene(SceneKey.Over, {
    message: "",
    finished: false,
    points: 0,
    distance: 0,
    maxSpeedMod: 0,
} as OverSceneParams) {
    tint: number;
    tints: number[];
    scrollA: number;
    scrollB: number;
    backgrounds: Phaser.GameObjects.Group;

    create() {
        super.create();

        if (DEBUG.fastRestart) return this.restartGame();

        this.tint = 15486564;
        this.tints = [16777215, 11184810, 6710886, 16777215, 11184810, 6710886, 2236962];

        this.scrollA = -GAME_HEIGHT;
        this.scrollB = -GAME_HEIGHT;

        this.backgrounds = this.add.group();
        this.backgrounds.add(new Background(this, .8, 0, .25).setTint(this.tints[0]));

        this.backgrounds.add(new Background(this, .5, 0, .5).setTint(this.tints[1]));
        this.backgrounds.add(new Background(this, 0, 0, 1).setTint(this.tints[2]));
        this.backgrounds.add(new Background(this, 2, 4, .25).setTint(this.tints[3]));
        this.backgrounds.add(new Background(this, 2.4, 3, .5).setTint(this.tints[4]));

        this.backgrounds.add(new Background(this, 2.5, 2, 1).setTint(this.tints[5]));
        this.backgrounds.add(new Background(this, 3, 5, 2).setTint(this.tints[6]));

        this.houses = [
            new House(this, 32, 0, 8).setFrames(4),
            new House(this, 160, 0, 8).setFrames(4),
            new House(this, 96, 0, 8).setFrames(4),
            new House(this, 64, 0, 8).setFrames(4),
            new House(this, 128, 0, 8).setFrames(4),
        ];

        const { message, finished, points, distance, maxSpeedMod } = this.params;

        const centerX = GAME_WIDTH / 2;

        this.add.bitmapText(centerX, TILESIZE, FontKey.Minogram, message)
            .setOrigin(0.5).setTint(finished ? 0x80ff80 : 0xff8080);

        this.add.bitmapText(centerX, GAME_HEIGHT - TILESIZE * 3, FontKey.Square, `Collected: ${points}\nMax distance: ${distance}\nMax speed bonus: ${maxSpeedMod}`)
            .setOrigin(0.5);

        setTimeout(() => {
            this.input.keyboard.on('keydown', () => this.restartGame());
            this.input.on('pointerdown', () => this.restartGame());
        }, 2000);
    }

    update() {
        if (
            (this.houses[0].setY(this.scrollA, 32),
                this.houses[1].setY(this.scrollA, 32),
                this.houses[2].setY(this.scrollA, 32),
                this.houses[3].setY(this.scrollB, 32),
                this.houses[4].setY(this.scrollB, 32),
                (this.scrollA += 0.2),
                (this.scrollB += 0.5),
                this.scrollA > 0 && (this.scrollA = -128),
                this.scrollB > 0 && (this.scrollB = -128),
                false)
        ) {
            this.cameras.main.setBackgroundColor(this.tint);
        }

    }

    private restartGame() {
        this.scene.start(SceneKey.Game);
    }
}
