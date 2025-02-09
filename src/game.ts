import Phaser from "phaser";

import { PreloadScene } from "./scenes/preload";
import { MainScene } from "./scenes/main";
import { TitleScene } from "./scenes/title";
import { LevelScene } from "./scenes/level";
import { OverScene } from "./scenes/over";
import { TutorialScene } from "./scenes/tutorial";
import { DevmodeScene } from "./scenes/devmode";

export type GameParams = {
    parentId: string,
    verticalSize: number,
    gravity: number,
    debug: boolean,
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
            autoCenter: Phaser.Scale.CENTER_BOTH,
            mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH,
            height: params.verticalSize,
            width: "100%",
            resizeInterval: 2000,
        }

        const physics: Phaser.Types.Core.PhysicsConfig = {
            default: "arcade",
            arcade: {
                gravity: { y: params.gravity, x: 0 },
                debug: params.debug,
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
