import { BootScene } from "./scenes/boot";
import { DevmodeScene } from "./scenes/devmode";
import { GameScene } from "./scenes/game";
import { OverScene } from "./scenes/over";
import { TutorialScene } from "./scenes/tutorial";

import {
    GAME_HEIGHT,
    GAME_WIDTH,
    PARENT_CONTAINER_ID,
} from './shared/constants';
import { DEBUG } from "./shared/settings";

export default new Phaser.Game({
    type: Phaser.WEBGL,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    pixelArt: true,
    roundPixels: true,
    antialias: false,
    scene: [BootScene, GameScene, OverScene, TutorialScene, DevmodeScene],
    parent: PARENT_CONTAINER_ID,
    scale: {
        mode: Phaser.Scale.WIDTH_CONTROLS_HEIGHT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: GAME_WIDTH,
        height: GAME_HEIGHT,
    },
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 400, x: 0 },
            debug: DEBUG.debugPhysics,
        }
    },
    dom: {
        createContainer: true
    },
    fps: {
        target: 60
    },
    powerPreference: "low-power",
    autoMobilePipeline: true,
    autoFocus: true,
    autoRound: true,
});
