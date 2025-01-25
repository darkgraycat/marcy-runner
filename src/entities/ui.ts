import { FontKey } from "../shared/keys";
import { formatString } from "../shared/utils";

export class UiText extends Phaser.GameObjects.BitmapText {
    private originalText: string
    constructor(
        scene: Phaser.Scene,
        text: string = "",
        x: number = 0,
        y: number = 0,
        font: string = FontKey.MKitText,
    ) {
        super(scene, x, y, font, text);
        scene.add.existing(this);
        this.originalText = text;
        this.setScrollFactor(0);
        this.setOrigin(0.5);
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
    private outerBackground: Phaser.GameObjects.Rectangle;
    private innerBackground: Phaser.GameObjects.Rectangle;
    private text: Phaser.GameObjects.BitmapText;
    private onClick: () => void;
    private tint: number;
    private borderTint: number;
    private highlightTint: number;

    constructor(
        scene: Phaser.Scene,
        text: string = "",
        x: number = 0,
        y: number = 0,
        onClick?: (self?: UiButton) => void,
        font: string = FontKey.MKitText,
    ) {
        super(scene, 0, 0);
        this.add(this.outerBackground = scene.add.rectangle(x, y, 0, 0, 0x000000).setOrigin(0.5))
        this.add(this.innerBackground = scene.add.rectangle(x, y, 0, 0, 0x000000).setOrigin(0.5))
        this.add(this.text = scene.add.bitmapText(x, y, font, text).setOrigin(0.5));
        this.setOnClick(onClick);
        this.setSize(this.text.width + 10, this.text.height + 8);
        this.setScrollFactor(0);
        scene.add.existing(this);
    }

    setSize(width: number, height: number) {
        // super.setSize(width, height);
        this.outerBackground.setSize(width, height);
        this.innerBackground.setSize(width - 2, height - 2);
        return this;
    }

    setTint(tint: number) {
        console.log("new tint for button", tint);
        this.tint = tint;
        this.borderTint = Phaser.Display.Color.IntegerToColor(tint).darken(10).color;
        this.highlightTint = Phaser.Display.Color.IntegerToColor(tint).lighten(5).color;
        this.innerBackground.fillColor = this.tint;
        this.outerBackground.fillColor = this.borderTint;
        return this;
    }

    setText(text: string) {
        this.text.setText(text);
        return this;
    }

    setOnClick(onClick: (self?: UiButton) => void) {
        this.onClick = onClick;
        this.refreshListeners();
        return this;
    }

    private setTints(outer?: number, inner?: number, text?: number) {
        if (outer) this.outerBackground.fillColor = outer;
        if (inner) this.innerBackground.fillColor = inner;
        if (text) this.text.setTint(text);
        return this;
    }

    private refreshListeners() {
        this.innerBackground
            .removeAllListeners()
            .setInteractive()
            .on(Phaser.Input.Events.POINTER_DOWN, () => this.setTints(this.tint, this.highlightTint))
            .on(Phaser.Input.Events.POINTER_UP, () => this.setTints(this.borderTint, this.tint).onClick())
            .on(Phaser.Input.Events.POINTER_OVER, () => this.setTints(this.borderTint, this.highlightTint))
            .on(Phaser.Input.Events.POINTER_OUT, () => this.setTints(this.borderTint, this.tint));
        return this;
    }
}
