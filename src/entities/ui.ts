import { GAME_DEFAULT_FONT } from "../shared/constants";
import { formatString } from "../shared/utils";

export class UiText extends Phaser.GameObjects.BitmapText {
    private originalText: string
    constructor(
        scene: Phaser.Scene,
        text: string = "",
        x: number = 0,
        y: number = 0,
        font: string = GAME_DEFAULT_FONT,
    ) {
        super(scene, x, y, font, text);
        scene.add.existing(this);
        this.originalText = text;
        this.setScrollFactor(0);
    }
    setTextArgs(...args: (string | number)[]) {
        const formatted = formatString(this.originalText, ...args);
        this.setText(formatted);
        return this;
    }
    setText(value: string | string[]): this {
        super.setText(value);
        return this;
    }
}

export class UiButton extends Phaser.GameObjects.Container {
    constructor(
        scene: Phaser.Scene,
        text: string = "",
        x: number = 0,
        y: number = 0,
        font: string = GAME_DEFAULT_FONT,
    ) {
        super(scene, 0, 0, []);
        // super(scene, 0, 0, font, text);
        scene.add.existing(this);
    }
}
