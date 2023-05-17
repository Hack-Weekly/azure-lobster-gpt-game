import Phaser from "phaser"

export default class Preload extends Phaser.Scene {
    constructor() {
        super({ key: "Preload" })
    }
    preload() {
        this.load.atlas("player", "public/player/playerSpritesheet.png", "public/player/playerAtlas.json")
    }

    create() {
        this.anims.create({
            key: "downIdle",
            frames: this.anims.generateFrameNames("player", { prefix: "downIdle", start: 0, end: 1 }),
            frameRate: 8,
            repeat: -1,
        })
        this.anims.create({
            key: "downWalk",
            frames: this.anims.generateFrameNames("player", { prefix: "downWalk", start: 0, end: 1 }),
            frameRate: 8,
            repeat: -1,
        })
        this.anims.create({
            key: "leftIdle",
            frames: this.anims.generateFrameNames("player", { prefix: "leftIdle", start: 0, end: 1 }),
            frameRate: 8,
            repeat: -1,
        })
        this.anims.create({
            key: "leftWalk",
            frames: this.anims.generateFrameNames("player", { prefix: "leftWalk", start: 0, end: 1 }),
            frameRate: 8,
            repeat: -1,
        })
        this.anims.create({
            key: "rightIdle",
            frames: this.anims.generateFrameNames("player", { prefix: "rightIdle", start: 0, end: 1 }),
            frameRate: 8,
            repeat: -1,
        })
        this.anims.create({
            key: "rightWalk",
            frames: this.anims.generateFrameNames("player", { prefix: "rightWalk", start: 0, end: 1 }),
            frameRate: 8,
            repeat: -1,
        })
        this.anims.create({
            key: "upIdle",
            frames: this.anims.generateFrameNames("player", { prefix: "upIdle", start: 0, end: 1 }),
            frameRate: 8,
            repeat: -1,
        })
        this.anims.create({
            key: "upWalk",
            frames: this.anims.generateFrameNames("player", { prefix: "upWalk", start: 0, end: 1 }),
            frameRate: 8,
            repeat: -1,
        })

        this.scene.start("Game")
    }
}
