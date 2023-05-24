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

    if (!res.ok) {
        throw new Error(`start-chat failed ${res.status}`)
    }
}

export async function getGptReplyStream() {
    let res = await fetch(BASE_URL + "/gpt-reply-stream", {
        headers: { "game-id": gameId! },
    })

    return res.body!.getReader()
}

export type NPCState = {
    name: string
    description: string
    location: string
}
