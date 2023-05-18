import Phaser from "phaser"
import EventDispatcher from "../utils/EventDispatcher"

export default class Chat extends Phaser.Scene {
    emitter!: EventDispatcher

    constructor() {
        super({ key: "Chat" })
    }
    preload() {
        this.emitter = EventDispatcher.getInstance()
    }
    create() {}
    update() {}
}
