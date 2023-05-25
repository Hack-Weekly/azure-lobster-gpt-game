const BASE_URL = "http://localhost:3000"

let gameId: string | null = null
let npcs: NPCState[] | null = null

export async function startGame(): Promise<string> {
    let res = await fetch(BASE_URL + "/start-game", {
        method: "POST",
    })

    let json = await res.json()
    gameId = json.gameId
    return gameId!
}

export async function startChat(npcName: string) {
    let res = await fetch(BASE_URL + "/start-chat", {
        method: "POST",
        headers: { "game-id": gameId!, "Content-Type": "application/json" },
        body: JSON.stringify({ npcName: npcName }),
    })

    if (!res.ok) throw new Error(`start-chat failed ${res.status}`)

    let transformStream = new TransformStream()
    pipeToChunks(res.body!.getReader(), transformStream.writable.getWriter())
    return transformStream.readable.getReader()
}

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

export async function endChat() {
    let res = await fetch(BASE_URL + "/end-chat", {
        method: "POST",
        headers: { "game-id": gameId! },
    })

    if (!res.ok) throw new Error(`end-chat failed ${res.status}`)
}

async function pipeToChunks(reader: ReadableStreamDefaultReader, writer: WritableStreamDefaultWriter) {
    let decoder = new TextDecoder()
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
