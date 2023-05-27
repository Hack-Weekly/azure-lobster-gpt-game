import Phaser from "phaser" //imports phaser library

import Game from "./scenes/GameScene" //GameScene represents main gameplay scene of the game
import Preload from "./scenes/PreloadScene" //PreloadScene is responsible for preloading game assets like images, sounds, etc.
import Chat from "./scenes/ChatScene" //ChatScene represents a scene where players can interact with a chat feature

const config: Phaser.Types.Core.GameConfig = { //configuration object
    type: Phaser.AUTO, //automatically detects the appropriate renderer (Canvas or WebGL) based on device capabilities
    parent: "app", //DOM element containing game canvas is app
    width: 800,
    height: 600,
    physics: {
        default: "matter", //physics engine
        matter: {
            gravity: { y: 0 },
            debug: true, // toggle for hitboxes
        },
    },
    scene: [Preload, Game, Chat], //the order determines the scene rendering order
    dom: {
        createContainer: true,
    },
    pixelArt: true,
    render: {
        antialias: false,
        pixelArt: true,
        roundPixels: true, //disables anti-aliasing and ensures objects are rendered on whole pixel positions
    },
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
}

export default new Phaser.Game(config)
