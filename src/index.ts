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
        if (key == 'p') {
            const { gameSize, displaySize, baseSize, parentSize } = game.scale;
            console.table({
                gameSize: [gameSize.width, gameSize.height],
                displaySize: [displaySize.width, displaySize.height],
                baseSize: [baseSize.width, baseSize.height],
                parentSize: [parentSize.width, parentSize.height],
            })
        }
        if (key == 'r') {
            gameDiv.classList.toggle('force-landscape');
        }
    });

    window.addEventListener("resize", () => {
        setTimeout(() => {
            game.scale.resize(window.innerWidth, window.innerHeight);
        }, 100);
    });

    function toggleFullscreen() {
        const elem = mainDiv;

        if (!document.fullscreenElement) {
            elem.requestFullscreen().then(() => {
                lockLandscape();
            }).catch(err => {
                console.error("Fullscreen error:", err);
            });
        } else {
            document.exitFullscreen();
        }
    }

    function lockLandscape() {
        // @ts-ignore
        if (screen.orientation && screen.orientation.lock) {
            // @ts-ignore
            screen.orientation.lock("landscape").catch((err: any) => {
                console.warn("Orientation lock failed:", err);
            });
        }
    }

    // Attach to a fullscreen button
    document.getElementById("fullscreen-btn").addEventListener("click", toggleFullscreen);
}

