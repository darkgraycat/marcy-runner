import Phaser from "phaser";

import { PreloadScene } from "./scenes/preload";
import { MainScene } from "./scenes/main";
import { TitleScene } from "./scenes/title";
import { LevelScene } from "./scenes/level";
import { OverScene } from "./scenes/over";
import { TutorialScene } from "./scenes/tutorial";
import { DevmodeScene } from "./scenes/devmode";

import { DEBUG, GAMEPLAY } from "./shared/settings";

export type GameParams = {
    parentId: string,
    gameHeight: number,
}

export class Game extends Phaser.Game {
    constructor(params: GameParams) {
        const scene: Phaser.Types.Scenes.SceneType[] = [
            PreloadScene,
            MainScene,
            TitleScene,
            LevelScene,
            OverScene,
            TutorialScene,
            DevmodeScene,
        ];

        const scale: Phaser.Types.Core.ScaleConfig = {
            mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH,
            autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
            height: params.gameHeight,
        }

        const physics: Phaser.Types.Core.PhysicsConfig = {
            default: "arcade",
            arcade: {
                gravity: { y: GAMEPLAY.gravity, x: 0 },
                debug: DEBUG.debugPhysics,
            }
        }

        const fps: Phaser.Types.Core.FPSConfig = {
            min: 60,
            target: 120,
            smoothStep: false,
            forceSetTimeOut: false,
        }

        const dom: Phaser.Types.Core.DOMContainerConfig = {
            createContainer: true,
        }

        const input: Phaser.Types.Core.InputConfig = {
            // doesnt work
            mouse: { preventDefaultWheel: true },
        }

        super({
            type: Phaser.WEBGL,
            pixelArt: true,
            parent: params.parentId,
            fullscreenTarget: params.parentId,
            scene, scale, input, physics, fps, dom,
            autoMobilePipeline: true,
            autoFocus: true,
            autoRound: true,
        });
    }
}
