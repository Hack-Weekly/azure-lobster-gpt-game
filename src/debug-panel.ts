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

addNpc({ name: "Kickball", description: "test npc description", location: "test npc location" })

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
    if (message.length === 0) {
        return
    }
    setLoading(true)
    let ele = document.createElement("div")
    ele.innerText = "You: " + message
    document.getElementById("message-list")!.append(ele)
    messageInput.value = ""
}

function appendEvent(message: string) {
    let ele = document.createElement("div")
    ele.innerText = message
    document.getElementById("events")!.append(ele)
}

function setLoading(loading: boolean) {
    let loadingIcon = document.getElementById("loading-icon") as HTMLImageElement
    let sendButton = document.getElementById("send-button") as HTMLButtonElement
    let messageInput = document.getElementById("message-input") as HTMLInputElement

    if (loading) {
        loadingIcon.setAttribute("display", "visible")
        sendButton.setAttribute("disabled", "")
        messageInput.setAttribute("disabled", "")
    } else {
        loadingIcon.setAttribute("display", "hidden")
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

async function startChat(npcName: string) {
    setView(true, npcName)
    setLoading(true)
    try {
        await ServerState.startChat(npcName)
    } catch (error) {
        console.log("Error starting chat")
        console.error(error)
        alert("Error starting chat: " + (error as Error).message)
        setView(false)
    } finally {
        let messageEle = document.createElement("div")
        messageEle.innerText = npcName + ": "
        document.getElementById("message-list")!.append(messageEle)
        await readIncomingMessage(messageEle)
        setLoading(false)
    }
}

async function readIncomingMessage(messageEle: HTMLDivElement) {
    let stream
    try {
        stream = await ServerState.getGptReplyStream()
    } catch (err) {
        console.log("Error getting GPT reply stream")
        console.log(err)
        alert("Error getting GPT reply stream: " + (err as Error).message)
        return
    }

    let decoder = new TextDecoder()
    try {
        let chunk = await stream.read()
        while (chunk !== null) {
            let message = decoder.decode(chunk.value)
            messageEle!.innerText += message
            chunk = await stream.read()
        }
    } catch (err) {
        console.log("Error reading GPT reply stream")
        console.log(err)
        alert("Error reading GPT reply stream: " + (err as Error).message)
    }
}

function addNpc(npc: NPCState) {
    let ele = document.createElement("div")
    ele.innerText = "Name:" + npc.name + "\nDescription:" + npc.description + "\nLocation:" + npc.location
    ele.id = "npc-" + npc.name

    let startChatButton = document.createElement("button")
    startChatButton.innerText = "Start Chat"

    startChatButton.addEventListener("click", () => startChat(npc.name))

    let div = document.createElement("div")
    div.append(startChatButton)
    ele.append(div)

    document.getElementById("npc-list")!.append(ele)
}
