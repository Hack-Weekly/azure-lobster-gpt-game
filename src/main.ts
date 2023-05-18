import Phaser from "phaser"

import Game from "./scenes/GameScene"
import Preload from "./scenes/PreloadScene"

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent: "app",
    width: 800,
    height: 600,
    physics: {
        default: "arcade",
    },
    scene: [Preload, Game],
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
