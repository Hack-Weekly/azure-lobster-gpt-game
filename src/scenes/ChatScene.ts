import Phaser from "phaser"
import EventDispatcher from "../utils/EventDispatcher"

export default class Chat extends Phaser.Scene {
    emitter!: EventDispatcher
    chatElement!: Phaser.GameObjects.DOMElement
    chatWindow!: HTMLElement

    constructor() {
        super({ key: "Chat" })
    }

    preload() {
        this.emitter = EventDispatcher.getInstance()
    }

    create() {
        console.log("Chat scene started")
        this.emitter.on("openChatWindow", this.openChat, this)

        // create chat window
        const chatWindowHTML = `
        <div id="chat-window" style="background-color: white; width: 400px; height: 300px; overflow: auto; display: none; padding: 10px; box-sizing: border-box;">
    <div id="chat-history" style="padding: 10px; box-sizing: border-box;"></div>
    <form id="message-form" style="position: absolute; bottom: 0; width: 100%; padding: 10px; background: #eee; box-sizing: border-box;">
        <input id="message-input" type="text" style="width: 80%; padding: 5px; border-radius: 10px; border: 1px solid #ccc;" placeholder="Enter message..." />
        <button type="submit" style="width: 18%; margin-left: 2%; padding: 5px; border-radius: 10px; border: 1px solid #ccc; background-color: #0084ff; color: white;">Send</button>
    </form>
</div>

        `

        this.chatElement = this.add.dom(400, 300, "div")
        this.chatElement.createFromHTML(chatWindowHTML)
        this.chatWindow = this.chatElement.getChildByID("chat-window") as HTMLElement
        this.chatElement.addListener("submit")
        this.chatElement.on("submit", this.sendMessage, this)

        // make chat window invisible initially
        this.chatWindow.style.display = "none"
    }

    openChat() {
        // make chat window visible
        this.chatWindow.style.display = "block"
        this.scene.pause("Game")
    }

    sendMessage(event: Event) {
        event.preventDefault()

        // get the message input
        const messageInput = this.chatElement.getChildByID("message-input") as HTMLInputElement
        const message = messageInput.value

        // add message to chat history
        const chatHistory = this.chatElement.getChildByID("chat-history") as HTMLElement
        const messageHTML = `<div style="max-width: 60%; padding: 10px; margin-bottom: 10px; background-color: #0084ff; color: white; border-radius: 20px; clear: both; float: right;">${message}</div>`
        chatHistory.innerHTML += messageHTML

        // clear the message input
        messageInput.value = ""
    }
}
