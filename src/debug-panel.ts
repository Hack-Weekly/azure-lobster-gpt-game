import * as ServerState from "./server-state.js"
import { NPCState } from "./server-state.js"

document.getElementById("send-button")!.addEventListener("click", () => {
    sendMessage()
})

document.getElementById("message-input")!.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        sendMessage()
    }
})

document.getElementById("end-chat-button")!.addEventListener("click", () => {
    ServerState.endChat()
})

addNpc({ name: "Rye", description: "test npc description", location: "test npc location" })

ServerState.startGame()
    .then((name) => {
        document.getElementById("game-id")!.innerText = name
        console.log("New game started")
    })
    .catch((error) => {
        console.log("Error starting new game")
        console.log(error)
    })
    .finally(() => {
        setLoading(false)
    })

async function sendMessage() {
    let messageInput = document.getElementById("message-input") as HTMLInputElement
    let message = messageInput.value.trim()
    if (message.length === 0) return

    setLoading(true)

    try {
        let stream = await ServerState.continueChat(message)
        await readReply(stream, true)
    } catch (error) {
        console.log("Error starting chat")
        console.error(error)
        alert("Error starting chat: " + (error as Error).message)
        setView(false)
    } finally {
        setLoading(false)
    }
}

async function startChat(npcName: string) {
    setView(true, npcName)
    setLoading(true)
    try {
        let stream = await ServerState.startChat(npcName)
        await readReply(stream, false)
    } catch (error) {
        console.log("Error starting chat")
        console.error(error)
        alert("Error starting chat: " + (error as Error).message)
        setView(false)
    } finally {
        setLoading(false)
    }
}

async function readReply(stream: any, expectChoice: boolean) {
    let messageEle = document.createElement("div")
    messageEle.innerText = `Reply: `

    document.getElementById("message-list")!.append(messageEle)

    let choice = ""

    let part = await stream.read()
    while (part !== null && !part.done) {
        console.log(part.value)
        let o = JSON.parse(part.value)

        if (o.type == "content") {
            if (expectChoice) {
                if (o.content.includes("\n")) {
                    expectChoice = false
                    choice += o.content.substring(0, o.content.indexOf("\n"))
                } else {
                    choice += o.content
                }
            } else {
                messageEle!.innerText += o.content
            }
        }

        part = await stream.read()
    }

    if (choice.includes("SAY_GOODBYE")) {
        setView(false)
    }
}

function addNpc(npc: NPCState) {
    let ele = document.createElement("div")
    ele.innerText = "Name: " + npc.name + "\nDescription: " + npc.description + "\nLocation: " + npc.location

    let startChatButton = document.createElement("button")
    startChatButton.innerText = "Start Chat"

    startChatButton.addEventListener("click", () => startChat(npc.name))

    let div = document.createElement("div")
    div.append(startChatButton)
    ele.append(div)

    document.getElementById("npc-list")!.append(ele)
}

function setLoading(loading: boolean) {
    let loadingIcon = document.getElementById("loading-icon") as HTMLImageElement
    let sendButton = document.getElementById("send-button") as HTMLButtonElement
    let messageInput = document.getElementById("message-input") as HTMLInputElement

    if (loading) {
        loadingIcon.removeAttribute("hidden")
        sendButton.setAttribute("disabled", "")
        messageInput.setAttribute("disabled", "")
    } else {
        loadingIcon.setAttribute("hidden", "")
        sendButton.removeAttribute("disabled")
        messageInput.removeAttribute("disabled")
    }
}

function setView(chatting: boolean, npcName?: string) {
    let chat = document.getElementById("chat") as HTMLDivElement
    let npcs = document.getElementById("not-chat") as HTMLDivElement
    if (chatting) {
        document.getElementById("chat-npc-name")!.innerText = npcName!
        chat.removeAttribute("hidden")
        npcs.setAttribute("hidden", "")
    } else {
        chat.setAttribute("hidden", "")
        npcs.removeAttribute("hidden")
    }
}
