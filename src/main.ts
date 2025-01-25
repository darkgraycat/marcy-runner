import { BootScene } from "./scenes/boot";
import { DevmodeScene } from "./scenes/devmode";
import { GameScene } from "./scenes/game";
import { OverScene } from "./scenes/over";
import { TutorialScene } from "./scenes/tutorial";

import { GAME_HEIGHT, GAME_WIDTH } from './shared/constants';
import { DEBUG } from "./shared/settings";

export default new Phaser.Game({
    type: Phaser.WEBGL,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    pixelArt: true,
    scene: [BootScene, GameScene, OverScene, TutorialScene, DevmodeScene],
    parent: "game-container",
    scale: {
        mode: Phaser.Scale.FIT,
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
    powerPreference: "low-power",
    autoMobilePipeline: true,
    autoFocus: true,
    roundPixels: true,
    autoRound: true,
    fps: {
        target: 60
    },
});
