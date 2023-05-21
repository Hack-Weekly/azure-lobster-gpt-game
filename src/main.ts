import Phaser from "phaser"

import Game from "./scenes/GameScene"
import Preload from "./scenes/PreloadScene"
import Chat from "./scenes/ChatScene"

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent: "app",
    width: 800,
    height: 600,
    physics: {
        default: "matter",
        matter: {
            gravity: { y: 0 },
            debug: true, // toggle for hitboxes
        },
    },
    scene: [Preload, Game, Chat],
    pixelArt: true,
    render: {
        antialias: false,
        pixelArt: true,
        roundPixels: true,
    },
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
}

export default new Phaser.Game(config)
