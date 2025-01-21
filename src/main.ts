import { BootScene } from "./scenes/boot";
import { GameScene } from "./scenes/game";
import { OverScene } from "./scenes/over";
import { TutorialScene } from "./scenes/tutorial";


import {
    GAME_HEIGHT,
    GAME_WIDTH,
} from './shared/constants';
import { DEBUG } from "./shared/settings";

export default new Phaser.Game({
    type: Phaser.WEBGL,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    pixelArt: true,
    scene: [BootScene, GameScene, OverScene, TutorialScene],
    parent: "content",
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
    powerPreference: "low-power",
    autoMobilePipeline: true,
    fps: { target: 60 },
    autoFocus: true,
    roundPixels: true,
    autoRound: true,
});
