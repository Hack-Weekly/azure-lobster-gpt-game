//sets up the game world including the tilemap, player sprite, camera, movement controls and interaction handling
import Phaser from "phaser"
import EventDispatcher from "../utils/EventDispatcher"

export default class Game extends Phaser.Scene {
    wkey!: Phaser.Input.Keyboard.Key
    akey!: Phaser.Input.Keyboard.Key
    skey!: Phaser.Input.Keyboard.Key
    dkey!: Phaser.Input.Keyboard.Key
    ekey!: Phaser.Input.Keyboard.Key
    emitter!: EventDispatcher
    player!: Phaser.Physics.Matter.Sprite
    playerFacingDir = "down"
    playerSpeed = 1.6
    playerCam!: Phaser.Cameras.Scene2D.Camera
    shadow!: Phaser.GameObjects.Image

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
        const plain = map.addTilesetImage("plain_", "plain")
        const plainCliff = map.addTilesetImage("plainCliff_", "plainCliff")
        const plainDeco0 = map.addTilesetImage("plainDecoration_0", "plainDeco0")
        const plainDeco1 = map.addTilesetImage("plainDecoration_1", "plainDeco1")
        const plainDeco2 = map.addTilesetImage("plainDecoration_2", "plainDeco2")
        const path = map.addTilesetImage("path_", "path")

        // create the layers we want in the right order
        const groundLayer = map.createLayer("base layer", [plain, plainCliff, path]).setDepth(-2)
        const bridgeLayer = map.createLayer("base 2", [plainDeco1, plainDeco2]).setDepth(-2)
        const freeLayer = map.createLayer("free layer", plainDeco0).setDepth(-2)
        const obstacleLayer = map.createLayer("obstacle layer", [plainDeco0, plainDeco2]).setDepth(2)

        groundLayer.setCollisionByProperty({ collides: true })
        obstacleLayer.setCollisionByProperty({ collides: true })
        bridgeLayer.setCollisionByProperty({ collides: true })

        this.matter.world.convertTilemapLayer(groundLayer)
        this.matter.world.convertTilemapLayer(obstacleLayer)
        this.matter.world.convertTilemapLayer(bridgeLayer)

        // // add all tileset images to tilemap
        // // the first argument is the name of the tileset in Tiled, the second is the key of the image in the cache
        // const waterObjects = map.addTilesetImage("Water Objects", "waterObjects")
        // const water = map.addTilesetImage("Water", "water")
        // const soil = map.addTilesetImage("Tilled Dirt", "soil")
        // const plantsRocks = map.addTilesetImage("Mushrooms, Flowers, Stones", "plantsRocks")
        // const paths = map.addTilesetImage("Paths", "paths")
        // const mailbox = map.addTilesetImage("Mailbox Animation Frames", "mailbox")
        // const house = map.addTilesetImage("Wooden House", "house")
        // const grassHillWater = map.addTilesetImage("Grass tiles with animates water-export", "grassHillWater")
        // const grassHillTiles = map.addTilesetImage("Grass hill tiles v.2", "grassHillTiles")
        // const grassHillTall = map.addTilesetImage("Tall Grass hill tiles v.2", "grassHillTall")
        // const furniture = map.addTilesetImage("Basic Furniture", "furniture")
        // const fences = map.addTilesetImage("Fences", "fences")
        // const door = map.addTilesetImage("door animation sprites", "door")
        // const bridge = map.addTilesetImage("Wood Bridge", "bridge")

        // // create the layers (order matters!)
        // const waterLayer = map.createLayer("water", water).setDepth(-1)
        // const baseLayer = map.createLayer("base", [house, grassHillWater]).setDepth(-1)
        // const hillsLayer = map.createLayer("hills", [house, grassHillWater, grassHillTiles, grassHillTall]).setDepth(-1)
        // const soilLayer = map.createLayer("soil", soil).setDepth(-1)
        // const greeneryLayer = map.createLayer("greenery", [plantsRocks, paths, waterObjects]).setDepth(-1)
        // const manmadeLayer = map.createLayer("manmade", [house, door, bridge]).setDepth(-1)
        // const fencesLayer = map.createLayer("fences", fences).setDepth(-1)
        // const furnitureLayer = map.createLayer("furniture", [furniture, mailbox]).setDepth(-1)
        // const roofLayer = map.createLayer("roof", house).setDepth(-1)

        // // create the collision boxes for each layer based on the custom property I set in the map editor
        // waterLayer.setCollisionByProperty({ collides: true })
        // baseLayer.setCollisionByProperty({ collides: true })
        // hillsLayer.setCollisionByProperty({ collides: true })
        // soilLayer.setCollisionByProperty({ collides: true })
        // greeneryLayer.setCollisionByProperty({ collides: true })
        // manmadeLayer.setCollisionByProperty({ collides: true })
        // fencesLayer.setCollisionByProperty({ collides: true })
        // furnitureLayer.setCollisionByProperty({ collides: true })
        // roofLayer.setCollisionByProperty({ collides: true })

        // // add the layers and collision boxes to the game world
        // this.matter.world.convertTilemapLayer(waterLayer)
        // this.matter.world.convertTilemapLayer(baseLayer)
        // this.matter.world.convertTilemapLayer(hillsLayer)
        // this.matter.world.convertTilemapLayer(soilLayer)
        // this.matter.world.convertTilemapLayer(greeneryLayer)
        // this.matter.world.convertTilemapLayer(manmadeLayer)
        // this.matter.world.convertTilemapLayer(fencesLayer)
        // this.matter.world.convertTilemapLayer(furnitureLayer)
        // this.matter.world.convertTilemapLayer(roofLayer)

        // movement controls
        this.wkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
        this.akey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
        this.skey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
        this.dkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        this.ekey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E)

        // create the players shadow before the player so that it is behind the player
        this.shadow = this.add.image(0, 0, "shadow").setScale(0.4).setAlpha(0.5)

        // create the player sprite
        this.player = this.matter.add.sprite(440, 800, "player").setScale(1)

        // set the player's hitbox and physics properties
        this.player.setBody(
            {
                type: "rectangle",
                width: 8, //player hitbox
                height: 10,
            },
            { render: { sprite: { xOffset: 0, yOffset: 0.17 } } }
        )

        this.player.setIgnoreGravity(true)
        this.player.setFixedRotation()

        // create camera and set to follow player
        this.playerCam = this.cameras.main.setBounds(0, 0, 1280, 1280)
        this.playerCam.zoom = 3 // camera zoom level
        // zooming the camera means that the top left of the screen is no longer positioned at (0,0)
        this.playerCam.startFollow(this.player)

        // start the Chat scene without ending the current scene
        this.scene.launch("Chat")
    }

    //called continuously during gameplay
    update() {
        this.movement()
        this.handleInteraction()
    }
    movement() {
        // Player Movement
        this.player.setVelocity(0, 0)

        // place the shadow below the player
        this.shadow.x = this.player.x
        this.shadow.y = this.player.y + 4

        if (this.wkey.isDown) {
            this.player.setVelocity(0, -this.playerSpeed)
            this.player.anims.play("upWalk", true)
        } else if (this.skey.isDown) {
            this.player.setVelocity(0, this.playerSpeed)
            this.player.anims.play("downWalk", true)
        } else if (this.akey.isDown) {
            this.player.setVelocity(-this.playerSpeed, 0)
            this.player.anims.play("leftWalk", true)
        } else if (this.dkey.isDown) {
            this.player.setVelocity(this.playerSpeed, 0)
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
    handleInteraction() {
        if (this.ekey.isDown) {
            // Remove the existing listeners
            this.input.keyboard.removeKey(this.wkey)
            this.input.keyboard.removeKey(this.akey)
            this.input.keyboard.removeKey(this.skey)
            this.input.keyboard.removeKey(this.dkey)
            this.input.keyboard.removeKey(this.ekey)

            this.emitter.emit("openChatWindow")
        }
    }
}
