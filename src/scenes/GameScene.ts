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
