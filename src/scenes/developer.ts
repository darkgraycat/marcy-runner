import { UiText } from "../entities/ui";
import { Scene } from "../shared/factories";
import { SceneKey } from "../shared/keys";

export class DeveloperScene extends Scene(SceneKey.Developer, {}) {
    create() {
        super.create();

        this.cameras.main.setBackgroundColor(0xffffff);
        
        const { width, height } = this.scale;
        new UiText(this, "dev")
            .setOrigin(0.5)
            .setTint(0x000000)
            .setPosition(width / 2, height / 2);
    }
}
