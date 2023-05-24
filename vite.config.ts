import { defineConfig } from "vite"
import { join, parse, resolve } from "path"

export default defineConfig({
    plugins: [],
    server: { host: "0.0.0.0", port: 8000 },
    clearScreen: false,
    build: {
        rollupOptions: {
            input: entryPoints("index.html", "debug-panel.html"),
        },
    },
})

function entryPoints(...paths: string[]) {
    const entries = paths.map(parse).map((entry) => {
        const { dir, base, name, ext } = entry
        const key = join(dir, name)
        const path = resolve(__dirname, dir, base)
        return [key, path]
    })

    return Object.fromEntries(entries)
}
