import Phaser from "phaser";


import { PreloadScene } from "./scenes/preload";
import { MainScene } from "./scenes/main";
import { TitleScene } from "./scenes/title";
import { GameScene } from "./scenes/game";
import { OverScene } from "./scenes/over";
import { TutorialScene } from "./scenes/tutorial";
import { DevmodeScene } from "./scenes/devmode";

import {
    GAME_HEIGHT,
    GAME_WIDTH,
    PARENT_CONTAINER_ID,
} from './shared/constants';
import { DEBUG, GAMEPLAY } from "./shared/settings";

export default new Phaser.Game({
    type: Phaser.WEBGL,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    pixelArt: true,
    scene: [
        PreloadScene,
        MainScene, 
        TitleScene,
        GameScene, 
        OverScene, 
        TutorialScene, 
        DevmodeScene,
    ],
    parent: PARENT_CONTAINER_ID,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: GAME_WIDTH,
        height: GAME_HEIGHT,
    },
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: GAMEPLAY.gravity, x: 0 },
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
