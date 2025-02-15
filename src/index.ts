import { Game } from "./game";
import { EventKey } from "./shared/keys";
import { DEBUG, GAMEPLAY } from "./shared/settings";
import { sleep } from "./shared/utils";

const VERTICAL_SIZE = 180;

window.onload = async function() {
    const mainDiv = document.getElementById("main") as HTMLDivElement;
    const gameDiv = document.getElementById("game") as HTMLDivElement;
    const overlayDiv = document.getElementById("overlay") as HTMLDivElement;

    await sleep(100);
    overlayDiv.classList.add("hidden");

    const game = new Game({
        parentId: "game",
        verticalSize: VERTICAL_SIZE,
        gravity: GAMEPLAY.gravity,
        debug: DEBUG.debugPhysics,
    });

    game.events.on(EventKey.FullScreenToggled, () => {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            gameDiv.requestFullscreen();
            // @ts-ignore
            screen.orientation.lock('landscape');
        }
    });




    // DEBUG

    // window.addEventListener('keydown', ({ key }) => {
    //     // if (key == 'o') handleOrientationChange();
    //     if (key == 'p') {
    //         const { gameSize, displaySize, baseSize, parentSize } = game.scale;
    //         console.table({
    //             gameSize: [gameSize.width, gameSize.height],
    //             displaySize: [displaySize.width, displaySize.height],
    //             baseSize: [baseSize.width, baseSize.height],
    //             parentSize: [parentSize.width, parentSize.height],
    //         })
    //     }
    //     if (key == 'r') {
    //         gameDiv.classList.toggle('force-landscape');
    //     }
    // });

    window.addEventListener("resize", () => {
        setTimeout(() => {
            // game.scale.updateScale();
            // game.scale.updateBounds();
            // game.scale.updateCenter();
            // game.scale.updateOrientation();
        }, 500);
    });

    // function handleOrientationChange() {
    //     // @ts-ignore
    //     if (screen.orientation && screen.orientation.lock) {
    //         // @ts-ignore
    //         screen.orientation.lock("landscape").catch((err: any) => {
    //             console.warn("Orientation lock failed:", err);
    //         });
    //     }

    // }

    // window.addEventListener('fullscreenchange', handleOrientationChange);
    // window.addEventListener('resize', handleOrientationChange);
    // window.addEventListener('orientationchange', handleOrientationChange);
}

