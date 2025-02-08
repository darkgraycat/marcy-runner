import game from "./game";

const sleep = (ms = 0) => new Promise(r => setTimeout(r, ms));
// const requestFullScreen = (e: HTMLElement) => (e.requestFullScreen || e.mozRequestFullScreen || e.webkitRequestFullscreen || e.msRequestFullscreen);

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

window.addEventListener("DOMContentLoaded", async () => {
    const mainDiv = document.getElementById("main") as HTMLDivElement;
    const gameDiv = document.getElementById("game") as HTMLDivElement;
    const overlayDiv = document.getElementById("overlay") as HTMLDivElement;

    await sleep(100);
    overlayDiv.classList.add("hidden");

    game.resume();

    window.addEventListener('keydown', ({ key }) => {
        // if (key == 'o') handleOrientationChange();
    })

})


