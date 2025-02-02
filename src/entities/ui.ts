import colors from "../data/colors";
import { UiElement } from "../shared/factories";
import { FontKey } from "../shared/keys";
import { formatString, forwardMethods } from "../shared/utils";

export class UiText extends UiElement({ font: FontKey.MKitText }) {
    private originalText: string

    constructor(scene: Phaser.Scene, text?: string) {
        super(scene, text);
        this.originalText = text || '';
    }

    setTextArgs(...args: (string | number)[]) {
        const formatted = formatString(this.originalText, ...args);
        this.setText(formatted);
        return this;
    }

    setOriginalText(text: string): this {
        this.originalText = text;
        return this;
    }
}

export class UiIconButton extends UiElement({ font: FontKey.MKitText }) {
    constructor(scene: Phaser.Scene, text?: string) {
        super(scene, text);
        this.setInteractive()
            .on('pointerover', () => this.setTint(colors.ui.onHover), this)
            .on('pointerout', () => this.setTint(colors.ui.default), this);
    }
}

// TODO: refactor
export class UiRectButton extends UiElement({ font: FontKey.MKitText }) {
    readonly rect: Phaser.GameObjects.Rectangle;
    private rectAlpha: number;

    constructor(scene: Phaser.Scene, text: string) {
        super(scene, text);

        this.rect = scene.add.rectangle(0, 0, 0, 0, 0x000000)
            .setScrollFactor(0)
            .setOrigin(0.5)
            .setInteractive()
            .on(Phaser.Input.Events.POINTER_OUT, () => this.rect.setAlpha(this.rectAlpha))
            .on(Phaser.Input.Events.POINTER_OVER, () => this.rect.setAlpha(this.rectAlpha + 0.2));

        this.updateRectSize()
            .setRectAlpha(0.6);
        forwardMethods(this, this.rect, ['setPosition', 'setOrigin', 'setScale', 'setVisible']);
    }

    setOnClick(onClick: (e?: Phaser.Input.Pointer) => void): this {
        this.rect
            .removeListener(Phaser.Input.Events.POINTER_DOWN)
            .setInteractive()
            .on(Phaser.Input.Events.POINTER_DOWN, onClick)
        return this;
    }

    updateRectSize(): this {
        this.rect?.setSize(this.width + 10, this.height + 8);
        return this;
    }

    setRectSize(width: number, height: number): this {
        this.rect.setSize(width, height);
        return this;
    }

    setRectTint(tint: number) {
        this.rect.fillColor = tint;
        return this;
    }

    setRectAlpha(alpha: number) {
        this.rectAlpha = alpha;
        this.rect.setAlpha(alpha);
        return this;
    }
}
