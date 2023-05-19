import Phaser from "phaser"

export default class Preload extends Phaser.Scene {
    constructor() {
        super({ key: "Preload" })
    }
    preload() {
        // player spritesheet and animation atlas
        this.load.atlas("player", "/player/playerSpritesheet.png", "/player/playerAtlas.json")

        // map tilesets
        this.load.image("bridge", "/map/tilesets/bridge.png")
        this.load.image("door", "/map/tilesets/door.png")
        this.load.image("fences", "/map/tilesets/fences.png")
        this.load.image("furniture", "/map/tilesets/furniture.png")
        this.load.image("grassHillTall", "/map/tilesets/grassHillTall.png")
        this.load.image("grassHillTiles", "/map/tilesets/grassHillTiles.png")
        this.load.image("grassHillWater", "/map/tilesets/grassHillWater.png")
        this.load.image("house", "/map/tilesets/house.png")
        this.load.image("mailbox", "/map/tilesets/mailbox.png")
        this.load.image("paths", "/map/tilesets/paths.png")
        this.load.image("plantsRocks", "/map/tilesets/plantsRocks.png")
        this.load.image("soil", "/map/tilesets/soil.png")
        this.load.image("water", "/map/tilesets/water.png")
        this.load.image("waterObjects", "/map/tilesets/waterObjects.png")

        // map json
        this.load.tilemapTiledJSON("tilemap", "/map/game-map.json")
    }

    create() {
        console.log("started preload")
        this.anims.create({
            key: "downIdle",
            frames: this.anims.generateFrameNames("player", { prefix: "downIdle", start: 0, end: 1 }),
            frameRate: 3,
            repeat: -1,
        })
        this.anims.create({
            key: "downWalk",
            frames: this.anims.generateFrameNames("player", { prefix: "downWalk", start: 0, end: 1 }),
            frameRate: 7,
            repeat: -1,
        })
        this.anims.create({
            key: "leftIdle",
            frames: this.anims.generateFrameNames("player", { prefix: "leftIdle", start: 0, end: 1 }),
            frameRate: 3,
            repeat: -1,
        })
        this.anims.create({
            key: "leftWalk",
            frames: this.anims.generateFrameNames("player", { prefix: "leftWalk", start: 0, end: 1 }),
            frameRate: 7,
            repeat: -1,
        })
        this.anims.create({
            key: "rightIdle",
            frames: this.anims.generateFrameNames("player", { prefix: "rightIdle", start: 0, end: 1 }),
            frameRate: 3,
            repeat: -1,
        })
        this.anims.create({
            key: "rightWalk",
            frames: this.anims.generateFrameNames("player", { prefix: "rightWalk", start: 0, end: 1 }),
            frameRate: 7,
            repeat: -1,
        })
        this.anims.create({
            key: "upIdle",
            frames: this.anims.generateFrameNames("player", { prefix: "upIdle", start: 0, end: 1 }),
            frameRate: 3,
            repeat: -1,
        })
        this.anims.create({
            key: "upWalk",
            frames: this.anims.generateFrameNames("player", { prefix: "upWalk", start: 0, end: 1 }),
            frameRate: 7,
            repeat: -1,
        })

        console.log("finished preload")
        this.scene.start("Game")
    }
}
