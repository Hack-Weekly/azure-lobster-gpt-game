import Phaser from "phaser"

export default class Game extends Phaser.Scene {
    wkey!: Phaser.Input.Keyboard.Key
    akey!: Phaser.Input.Keyboard.Key
    skey!: Phaser.Input.Keyboard.Key
    dkey!: Phaser.Input.Keyboard.Key
    player!: Phaser.Physics.Matter.Sprite
    playerSpeed: number = 100
    playerDir!: string
    playerCam!: Phaser.Cameras.Scene2D.Camera

    constructor() {
        super({ key: "Game" })
    }

    preload() {}

    create() {
        // make it so right clicks don't open that menu pop up thing
        this.input.mouse.disableContextMenu()

        // movement controls
        this.wkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
        this.akey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
        this.skey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
        this.dkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)

        this.player = this.matter.add.sprite(467.5, 405, "player").setScale(0.25)
        this.player.state = 0
        this.playerDir = "down"

        this.player.setBody(
            {
                type: "rectangle",
                width: 10, //player hitbox
                height: 13,
            },
            { render: { sprite: { xOffset: 0, yOffset: 0.23 } } }
        )
        // @ts-ignore
        this.player.body.setIgnoreGravity(true)
        this.player.setFixedRotation()

        // create camera and set to follow player
        this.playerCam = this.cameras.main.setBounds(0, 0, 1280, 1280)
        this.playerCam.zoom = 3 // camera zoom level - 3 default
        // zooming the camera means that the top left of the screen is no longer positioned at (0,0)
        this.playerCam.startFollow(this.player)
    }

    update() {
        // Player Movement
        if (this.wkey.isDown) {
            this.player.setVelocityY(-this.playerSpeed)
            this.player.anims.play("upWalk", true)
        } else if (this.skey.isDown) {
            this.player.setVelocityY(this.playerSpeed)
            this.player.anims.play("downWalk", true)
        } else {
            this.player.setVelocityY(0)
            if (this.player.anims.currentAnim && this.player.anims.currentAnim.key === "upWalk")
                this.player.anims.play("upIdle", true)
            if (this.player.anims.currentAnim && this.player.anims.currentAnim.key === "downWalk")
                this.player.anims.play("downIdle", true)
        }

        if (this.akey.isDown) {
            this.player.setVelocityX(-this.playerSpeed)
            this.player.anims.play("leftWalk", true)
        } else if (this.dkey.isDown) {
            this.player.setVelocityX(this.playerSpeed)
            this.player.anims.play("rightWalk", true)
        } else {
            this.player.setVelocityX(0)
            if (this.player.anims.currentAnim && this.player.anims.currentAnim.key === "leftWalk")
                this.player.anims.play("leftIdle", true)
            if (this.player.anims.currentAnim && this.player.anims.currentAnim.key === "rightWalk")
                this.player.anims.play("rightIdle", true)
        }
    }
}
