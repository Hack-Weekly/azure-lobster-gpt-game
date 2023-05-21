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
            <div id="chat-window" style="background-color: white; width: 400px; height: 300px; overflow: auto; display: none;">
                <div id="chat-history" style="padding: 10px;"></div>
                <form id="message-form" style="position: absolute; bottom: 0; width: 100%; padding: 10px; background: #eee;">
                    <input id="message-input" type="text" style="width: 85%;" placeholder="Enter message..." />
                    <button type="submit" style="width: 15%;">Send</button>
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
    }

    sendMessage(event: Event) {
        event.preventDefault()

        // get the message input
        const messageInput = this.chatElement.getChildByID("message-input") as HTMLInputElement
        const message = messageInput.value

        // add message to chat history
        const chatHistory = this.chatElement.getChildByID("chat-history")
        chatHistory.innerHTML += `<p>${message}</p>`

        // clear the message input
        messageInput.value = ""
    }
}
