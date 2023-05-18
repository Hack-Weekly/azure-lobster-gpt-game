import Phaser from "phaser"

let instance: EventDispatcher | null = null

export default class EventDispatcher extends Phaser.Events.EventEmitter {
    private constructor() {
        super()
        if (!instance) {
            instance = this
        }
    }

    public static getInstance(): EventDispatcher {
        if (!instance) {
            instance = new EventDispatcher()
        }
        return instance
    }
}
