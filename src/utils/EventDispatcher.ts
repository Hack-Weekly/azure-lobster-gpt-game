import Phaser from "phaser"

export default class EventDispatcher extends Phaser.Events.EventEmitter {
    private static instance: EventDispatcher | null = null

    private constructor() {
        super()
    }

    public static getInstance(): EventDispatcher {
        if (!EventDispatcher.instance) {
            EventDispatcher.instance = new EventDispatcher()
        }
        return EventDispatcher.instance
    }
}
