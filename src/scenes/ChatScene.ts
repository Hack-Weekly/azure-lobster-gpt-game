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
        <head>
            <link rel="stylesheet" href="chat/chat.css" />
        </head>
        <body>
            <div id="chat-window">
                <div id="chat-container" class="container">

                </div>
                <form id="input-container">
                    <input type="text" id="user-input" placeholder="Type your message...">
                    <button id="send-button">Send</button>
                </form>
            </div>
        </body>

        `

        this.chatElement = this.add.dom(150, 100, "html")
        this.chatElement.createFromHTML(chatWindowHTML)
        this.chatWindow = this.chatElement.getChildByID("chat-window") as HTMLElement

        const messageForm = this.chatElement.getChildByID("input-container") as HTMLFormElement
        messageForm.addEventListener("submit", (event: Event) => {
            event.preventDefault()
            this.sendMessage()
        })

        // make chat window invisible initially
        this.chatWindow.style.display = "none"
    }

    openChat() {
        // make chat window visible
        this.chatWindow.style.display = "block"
        // this.scene.pause("Game")
    }

    sendMessage() {
        // get the message input
        const messageInput = this.chatElement.getChildByID("user-input") as HTMLInputElement
        const message = messageInput.value

        // add message to chat history
        const chatHistory = this.chatElement.getChildByID("chat-container") as HTMLElement
        const messageHTML = `<div class="message user-message" style="background-color: #333; color: #fff; padding: 10px; margin-bottom: 10px; border-radius: 5px; align-self: flex-end; word-wrap: break-word; overflow-wrap: break-word; max-width: 80%;">${message}</div>`

        chatHistory.innerHTML += messageHTML

        // clear the message input
        messageInput.value = ""
    }
}
