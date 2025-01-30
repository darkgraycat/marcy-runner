import levels, { LevelsData, LevelsDataBgIdxs } from "../data/levels";
import { Background } from "../entities/background";
import { Building } from "../entities/building";
import { Scene } from "../shared/factories";
import { SceneKey } from "../shared/keys";

const BGIDX_FRAME = 0;
const BGIDX_Y = 1;
const BGIDX_COLOR = 2;
const BGIDX_SCROLL_SCALE = 3;

export type DevmodeSceneParams = {
    levelIdx: number,
}

export class DevmodeScene extends Scene(SceneKey.Devmode, {
    levelIdx: 0,
} as DevmodeSceneParams) {
    backgrounds: Phaser.GameObjects.Group;
    buildings: Phaser.GameObjects.Group;
    levelData: LevelsData;

    create() {
        super.create();

        const { width, height } = this.scale;
        const level = levels[this.params.levelIdx];

        this.cameras.main.setBackgroundColor(0x222222);

        this.backgrounds = this.add.group({ runChildUpdate: false });
        for (const [frame, y, color, scrollScale] of level.backgrounds) {
            this.backgrounds.add(new Background(this, frame, y, scrollScale).setTint(color))
        }

        this.buildings = this.add.group({ runChildUpdate: false });
        for (let i = 0; i < 2; i++) {
            this.buildings.add(new Building(this, i, 1.5)
                .setTint(level.buildings)
                .randomize()
            );
        }

        this.cameras.main.setBackgroundColor(level.sky);

        this.levelData = {
            sky: level.sky,
            buildings: level.buildings,
            backgrounds: level.backgrounds.map(bg => [...bg]),
        }

        this.add.dom(0, 0).createFromHTML(`
            <style>
                .devmode-txt {
                    color: white;
                    font-family: monospace;
                    font-size: 4px;
                    -webkit-appearance: none;
                    -moz-appearance: none;
                    border: 0;
                    outline: 0;
                    padding: 0;
                    background: transparent;
                    width: 32px;
                    height: 8px;
                }
                .devmode-clr { -webkit-appearance: none; border: 2; outline: 0; padding: 0; width: 8px; height: 8px; }
                .devmode-clr::-webkit-color-swatch-wrapper { padding: 0; }
                .devmode-clr::-webkit-color-swatch { border: none; }
            </style>
        `);

        const createColorInput = (x: number, y: number, color: number) => this.add.dom(x, y)
            .createFromHTML(`<input class="devmode-clr" type="color" value="#${color.toString(16)}"/>`);
        const createTextInput = (x: number, y: number, text: string) => this.add.dom(x, y)
            .createFromHTML(`<input class="devmode-txt" type="text" value="${text}"/>`);
        const createButton = (x: number, y: number, text: string) => this.add.dom(x, y)
            .createFromHTML(`<button class=devmode-txt>${text}</button>`);

        const inputsYOffset = 32;
        const inputsYGap = 16;
        this.levelData.backgrounds.forEach(([frame, y, color, scrollScale], i) => {
            createColorInput(width - 8, i * inputsYGap + inputsYOffset, color)
                .addListener('change')
                .on('change', ({ target }) => {
                    const color = parseInt(target.value.slice(1), 16);
                    this.levelData.backgrounds[i][BGIDX_COLOR] = color;
                    (this.backgrounds.getChildren()[i] as Background).setTint(color);
                    console.log("update bg color", i, target.value);
                });

            createTextInput(width - 32, i * inputsYGap + inputsYOffset, `${frame} ${y} ${scrollScale}`)
                .addListener('change')
                .on('change', ({ target }) => {
                    const [frame, y, scrollScale] = target.value.split(' ');
                    (this.backgrounds.getChildren()[i] as Background)
                        .setFrame(+frame)
                        .placeByTile(0, +y);
                    this.levelData.backgrounds[i][BGIDX_FRAME] = +frame;
                    this.levelData.backgrounds[i][BGIDX_Y] = +y;
                    this.levelData.backgrounds[i][BGIDX_SCROLL_SCALE] = +scrollScale;
                    console.log("update bg params", i, target.value);
                });
        });

        createColorInput(width - 8, 0 + 16, this.levelData.sky)
            .addListener('change')
            .on('change', ({ target }) => {
                const color = parseInt(target.value.slice(1), 16);
                this.cameras.main.setBackgroundColor(color);
                this.levelData.sky = color;
                console.log("update sky color", target.value);
            });

        createColorInput(width - 8, height - 16, this.levelData.buildings)
            .addListener('change')
            .on('change', ({ target }) => {
                const color = parseInt(target.value.slice(1), 16);
                this.levelData.buildings = color;
                this.buildings.getChildren().forEach(b => (b as Building).setTint(color));
                console.log("update buildings color", target.value);
            });

        createButton(0 + 16, 0 + 0, "Print")
            .addListener('click')
            .on('click', ({ target }) => {
                console.log("printing");
                this.printLevelData();
            });

    }

    update(time: number, delta: number): void {
        this.backgrounds.getChildren().forEach((c, index) => {
            const bg = c as Background;
            bg.tilePositionX += this.levelData.backgrounds[index][LevelsDataBgIdxs.SCROLL_SCALE];
        });
    }

    private printLevelData() {
        const hex = (v: number) => '0x' + v.toString(16);
        const output = `{ // ${this.params.levelIdx}`
            + `\n\tsky: ${hex(this.levelData.sky)},`
            + `\n\tbuildings: ${hex(this.levelData.buildings)},`
            + `\n\tbackgrounds: [`
            + `\n\t\t${this.levelData.backgrounds.map(([f, y, c, s]) => {
                return `[${f}, ${y}, ${hex(c)}, ${s}]`;
            }).join(',\n\t\t')}`
            + `,\n\t],`
            + `\n},`

        console.log(output);
    }
}
