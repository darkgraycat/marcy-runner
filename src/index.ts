import { Game } from "./game";
import { DEBUG, GAMEPLAY } from "./shared/settings";
import { sleep } from "./shared/utils";

// const requestFullScreen = (e: HTMLElement) => (e.requestFullScreen || e.mozRequestFullScreen || e.webkitRequestFullscreen || e.msRequestFullscreen);

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
    game.scale.lockOrientation('landscape');


    // const handleOrientationChange = (e) => {
    //     console.log(
    //         'in ' + (window.innerWidth >= window.innerHeight
    //             ? 'landscape mode'
    //             : 'portrait mode'),
    //         'fullscreen', document.fullscreenElement != null,
    //     );

    //     if (
    //         document.fullscreenElement != null &&
    //         window.innerWidth < window.innerHeight
    //     ) {
    //         console.log('ADD CLASS');
    //         mainDiv.classList.add('force-landscape');

    //     } else {
    //         console.log('REMOVE CLASS');
    //         mainDiv.classList.remove('force-landscape');
    //     }
    // }
    //

    // window.addEventListener('fullscreenchange', handleOrientationChange);
    // window.addEventListener('resize', handleOrientationChange);
    // window.addEventListener('orientationchange', handleOrientationChange);


    // DEBUG

    window.addEventListener('keydown', ({ key }) => {
        // if (key == 'o') handleOrientationChange();
        if (key == 'r') {
            console.table({
                gameSize: [game.scale.gameSize.width, game.scale.gameSize.height],
                displaySize: [game.scale.displaySize.width, game.scale.displaySize.height],
                baseSize: [game.scale.baseSize.width, game.scale.baseSize.height],
                parentSize: [game.scale.parentSize.width, game.scale.parentSize.height],
            })
            console.log('refreshing size................');

            // const gameWidth = 320;
            // const gameHeight = 180;

            // // Resize the game canvas to match the screen width and fixed height
            // this.scale.resize(window.innerWidth, gameHeight);

            // // Recalculate the scale factor for dynamic width
            // const scaleFactor = window.innerWidth / gameWidth;

            // // Update the camera's viewport (adjust to new size and keep it centered)
            // this.cameras.main.setViewport(0, 0, gameWidth * scaleFactor, gameHeight);
        }
    });

}

