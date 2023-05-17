import Phaser from 'phaser'

export default class HelloWorldScene extends Phaser.Scene {
	constructor() {
		super('hello-world')
	}

	preload() {
		this.load.setBaseURL('https://labs.phaser.io')

		this.load.image('sky', 'assets/skies/space3.png')
		this.load.image('logo', 'assets/sprites/phaser3-logo.png')
		this.load.image('red', 'assets/particles/red.png')
		this.load.aseprite('player', 'https://raw.githubusercontent.com/photonstorm/phaser3-examples/master/public/assets/tests/player.png', 'https://raw.githubusercontent.com/photonstorm/phaser3-examples/master/public/assets/tests/player.json')
		this.load.image("player-sheet", "https://raw.githubusercontent.com/photonstorm/phaser3-examples/master/public/assets/tests/player.png")
	}

	create() {
		// this.add.image(400, 300, 'sky')
		//
		// const particles = this.add.particles('red')
		//
		// const emitter = particles.createEmitter({
		// 	speed: 100,
		// 	scale: { start: 1, end: 0 },
		// 	blendMode: 'ADD',
		// })
		//
		// const logo = this.physics.add.image(400, 100, 'bot')
		//
		// logo.setVelocity(100, 200)
		// logo.setBounce(1, 1)
		// logo.setCollideWorldBounds(true)
		//
		// emitter.startFollow(logo)

		this.add.image(400, 300, 'sky')

		const particles = this.add.particles('red')

		const emitter = particles.createEmitter({
			speed: 100,
			scale: { start: 1, end: 0 },
			blendMode: 'ADD',
		})

		const logo = this.physics.add.image(400, 100, 'logo')

		logo.setVelocity(100, 200)
		logo.setBounce(1, 1)
		logo.setCollideWorldBounds(true)

		emitter.startFollow(logo)

		// Animated sprite from Aseprite
		this.anims.createFromAseprite("player")
		const player = new Phaser.GameObjects.Container(this)
		const sprite = this.add.sprite(20, 20, "player")
		player.add(sprite)
		this.add.existing(player)
		sprite.play({ key: "PLAYER_IDLE_D", repeat: -1 })
	}
}
