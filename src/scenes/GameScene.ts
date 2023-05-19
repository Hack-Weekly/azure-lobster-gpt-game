import Phaser from "phaser"
import EventDispatcher from "../utils/EventDispatcher"

export default class Game extends Phaser.Scene {
    wkey!: Phaser.Input.Keyboard.Key
    akey!: Phaser.Input.Keyboard.Key
    skey!: Phaser.Input.Keyboard.Key
    dkey!: Phaser.Input.Keyboard.Key
    emitter!: EventDispatcher
    player!: Phaser.Physics.Arcade.Sprite
    playerFacingDir = "down"
    playerSpeed = 100
    playerCam!: Phaser.Cameras.Scene2D.Camera

    constructor() {
        super({ key: "Game" })
    }

    preload() {
        this.emitter = EventDispatcher.getInstance()
    }

    create() {
        console.log("started game")
        // make it so right clicks don't open that menu pop up thing
        this.input.mouse.disableContextMenu()

        // create tilemap for main map
        const map = this.make.tilemap({ key: "tilemap" })

        // add all tileset images to tilemap
        const waterObjects = map.addTilesetImage("waterObjects_", "waterObjects")
        const water = map.addTilesetImage("water_", "water")
        const soil = map.addTilesetImage("soil_", "soil")
        const plantsRocks = map.addTilesetImage("plantsRocks_", "plantsRocks")
        const paths = map.addTilesetImage("paths_", "paths")
        const mailbox = map.addTilesetImage("mailbox_", "mailbox")
        const house = map.addTilesetImage("house_", "house")
        const grassHillWater = map.addTilesetImage("grassHillWater_", "grassHillWater")
        const grassHillTiles = map.addTilesetImage("grassHillTiles_", "grassHillTiles")
        const grassHillTall = map.addTilesetImage("grassHillTall_", "grassHillTall")
        const furniture = map.addTilesetImage("furniture_", "furniture")
        const fences = map.addTilesetImage("fences_", "fences")
        const door = map.addTilesetImage("door_", "door")
        const bridge = map.addTilesetImage("bridge_", "bridge")

        // create the layers (order matters!)
        const waterLayer = map.createLayer("water", [water]).setDepth(-1)
        const baseLayer = map.createLayer("base", [house, grassHillWater]).setDepth(-1)
        const hillsLayer = map.createLayer("hills", [house, grassHillWater, grassHillTiles, grassHillTall]).setDepth(-1)
        const soilLayer = map.createLayer("soil", [soil]).setDepth(-1)
        const greeneryLayer = map.createLayer("greenery", [plantsRocks, paths, waterObjects]).setDepth(-1)
        const manmadeLayer = map.createLayer("manmade", [house, door, bridge]).setDepth(-1)
        const fencesLayer = map.createLayer("fences", [fences]).setDepth(-1)
        const furnitureLayer = map.createLayer("furniture", [furniture, mailbox]).setDepth(-1)
        const roofLayer = map.createLayer("roof", [house]).setDepth(-1)

        // create the collision boxes for each layer based on the custom property I set in the map editor
        waterLayer.setCollisionByProperty({ collides: true })
        baseLayer.setCollisionByProperty({ collides: true })
        hillsLayer.setCollisionByProperty({ collides: true })
        soilLayer.setCollisionByProperty({ collides: true })
        greeneryLayer.setCollisionByProperty({ collides: true })
        manmadeLayer.setCollisionByProperty({ collides: true })
        fencesLayer.setCollisionByProperty({ collides: true })
        furnitureLayer.setCollisionByProperty({ collides: true })
        roofLayer.setCollisionByProperty({ collides: true })

        // add the layers and collision boxes to the game world
        this.matter.world.convertTilemapLayer(waterLayer)
        this.matter.world.convertTilemapLayer(baseLayer)
        this.matter.world.convertTilemapLayer(hillsLayer)
        this.matter.world.convertTilemapLayer(soilLayer)
        this.matter.world.convertTilemapLayer(greeneryLayer)
        this.matter.world.convertTilemapLayer(manmadeLayer)
        this.matter.world.convertTilemapLayer(fencesLayer)
        this.matter.world.convertTilemapLayer(furnitureLayer)
        this.matter.world.convertTilemapLayer(roofLayer)

        // movement controls
        this.wkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
        this.akey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
        this.skey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
        this.dkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)

        this.player = this.physics.add.sprite(467.5, 405, "player").setScale(3)

        // set body size for Arcade physics
        this.player.body.setSize(10, 13) // player hitbox
        this.player.body.offset.x = 0
        this.player.body.offset.y = 0.23

        // create camera and set to follow player
        this.playerCam = this.cameras.main.setBounds(0, 0, 1280, 1280)
        // this.playerCam.zoom = 0 // camera zoom level
        // zooming the camera means that the top left of the screen is no longer positioned at (0,0)
        this.playerCam.startFollow(this.player)

        // start the Chat scene without ending the current scene
        this.scene.launch("Chat")
    }

    update() {
        // Player Movement
        this.player.setVelocity(0)

        if (this.wkey.isDown) {
            this.player.setVelocityY(-this.playerSpeed)
            this.player.anims.play("upWalk", true)
        } else if (this.skey.isDown) {
            this.player.setVelocityY(this.playerSpeed)
            this.player.anims.play("downWalk", true)
        } else if (this.akey.isDown) {
            this.player.setVelocityX(-this.playerSpeed)
            this.player.anims.play("leftWalk", true)
        } else if (this.dkey.isDown) {
            this.player.setVelocityX(this.playerSpeed)
            this.player.anims.play("rightWalk", true)
        } else {
            // Idle animations
            if (this.player.anims.currentAnim && this.player.anims.currentAnim.key === "upWalk") {
                this.player.anims.play("upIdle", true)
            }
            if (this.player.anims.currentAnim && this.player.anims.currentAnim.key === "downWalk") {
                this.player.anims.play("downIdle", true)
            }
            if (this.player.anims.currentAnim && this.player.anims.currentAnim.key === "leftWalk") {
                this.player.anims.play("leftIdle", true)
            }
            if (this.player.anims.currentAnim && this.player.anims.currentAnim.key === "rightWalk") {
                this.player.anims.play("rightIdle", true)
            }
        }
    }
}
