const BASE_URL = "http://localhost:3000"

let gameId: string | null = null
let npcs: NPCState[] | null = null

//sends a POST request to the server to start a new game
//returns a promise that resolves with the game ID as a string
export async function startGame(): Promise<string> { 
    let res = await fetch(BASE_URL + "/start-game", {
        method: "POST",
    })

    let json = await res.json()
    gameId = json.gameId
    return gameId!
}

//sends a POST request to the server to start a chat with a specific NPC
//returns a readable stream reader that can be used to read chat messages from the server
export async function startChat(npcName: string) {
    let res = await fetch(BASE_URL + "/start-chat", {
        method: "POST",
        headers: { "game-id": gameId!, "Content-Type": "application/json" },
        body: JSON.stringify({ npcName: npcName }),
    })

    if (!res.ok) throw new Error(`start-chat failed ${res.status}`) //if request was not successful, throws error

    let transformStream = new TransformStream() //to process response body as chunks of data
    pipeToChunks(res.body!.getReader(), transformStream.writable.getWriter()) //pipes response body to transform stream
    return transformStream.readable.getReader()
}

//sends a POST request to the server to continue a chat by sending a message
//returns a readable stream reader that can be used to read chat messages from the server
export async function continueChat(message: string) {
    let res = await fetch(BASE_URL + "/continue-chat", {
        method: "POST",
        headers: { "game-id": gameId!, "Content-Type": "application/json" },
        body: JSON.stringify({ message: message }),
    })

    if (!res.ok) throw new Error(`continue-chat failed ${res.status}`)

    let transformStream = new TransformStream()
    pipeToChunks(res.body!.getReader(), transformStream.writable.getWriter())
    return transformStream.readable.getReader()
}

//sends a POST request to the server to end the current chat session
export async function endChat() {
    let res = await fetch(BASE_URL + "/end-chat", {
        method: "POST",
        headers: { "game-id": gameId! },
    })

    if (!res.ok) throw new Error(`end-chat failed ${res.status}`)
}

//helper function that pipes data from a readable stream to a writable stream in chunks
async function pipeToChunks(reader: ReadableStreamDefaultReader, writer: WritableStreamDefaultWriter) {
    let decoder = new TextDecoder() //to decode incoming chunks
    let chunk = await reader.read()
    while (chunk !== null && !chunk.done) {
        let lines = decoder
            .decode(chunk.value)
            .split("\r\n")
            .map((line) => line.trim())
            .filter((line) => line.length > 0)

        for (let line of lines) {
            let o = JSON.parse(line)
            if (o.type === "shittyHack") {
                continue
            }

            await writer.write(line)
        }

        chunk = await reader.read()
    }

    await writer.close()
}

export type NPCState = {
    name: string
    description: string
    location: string
}
