import { rowHeight } from "./main.js"

class Indexing {
    constructor(ctx = null, width = 30) {
        this.ctx = ctx
        this.width = width
        this.rowHeight = rowHeight
        console.log("indexing is created")
    }

    display() {
        this.ctx.strokeStyle = "rgb(196,199,197)"
        let yOffset = 30-8
        let rowName = 1
        for (let height of this.rowHeight) {
            this.ctx.strokeRect(0, yOffset, this.width, height)
            this.ctx.fillStyle="black"
            this.ctx.fillText(rowName === 0 ? "" : rowName, (this.width - 8) / 2, (2 * yOffset + height) / 2)
            rowName++
            yOffset += height
        }
    }
}

export { Indexing }
