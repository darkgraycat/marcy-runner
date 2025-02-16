import { Game } from "./game";
import { EventKey } from "./shared/keys";
import { DEBUG, GAMEPLAY } from "./shared/settings";
import { sleep } from "./shared/utils";

const { log } = console;

const VERTICAL_SIZE = 180;

window.onload = async function() {
    const mainDiv = document.getElementById("main") as HTMLDivElement;
    const gameDiv = document.getElementById("game") as HTMLDivElement;
    const debugDiv = document.getElementById("debug") as HTMLTextAreaElement;
    const overlayDiv = document.getElementById("overlay") as HTMLDivElement;

    if (DEBUG.useDebugLogs) {
        console.log = (...args: any[]) => {
            log(...args);
            debugDiv.textContent += args + '\n';
            debugDiv.scrollTop = debugDiv.scrollHeight;
        }
    } else {
        debugDiv.classList.add("hidden");
    }


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
}

