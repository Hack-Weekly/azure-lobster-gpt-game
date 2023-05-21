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
    create() {
        console.log("Chat scene started")
        this.emitter.on("updateHealth", this.openChat, this)
        // create all the necessary UI elements here but make them invisible
    }
    openChat() {
        // make all the UI elements visible
    }
}
