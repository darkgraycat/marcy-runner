import Phaser from "phaser";

import { PreloadScene } from "./scenes/preload";
import { MainScene } from "./scenes/main";
import { TitleScene } from "./scenes/title";
import { LevelScene } from "./scenes/level";
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
    pixelArt: true,
    scene: [
        PreloadScene,
        MainScene, 
        TitleScene,
        LevelScene, 
        OverScene, 
        TutorialScene, 
        DevmodeScene,
    ],
    parent: PARENT_CONTAINER_ID,
    fullscreenTarget: PARENT_CONTAINER_ID,
    scale: {
        mode: Phaser.Scale.FIT,
        // mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH,
        autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
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
        min: 60,
        target: 120,
        smoothStep: false,
        forceSetTimeOut: false,
    },
    // doesnt work
    // input: {
    //     mouse: { preventDefaultWheel: true },
    // },
    // autoMobilePipeline: true,
    // autoFocus: true,
    // autoRound: true,
});
