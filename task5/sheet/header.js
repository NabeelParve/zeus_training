import { colWidth } from "./main.js"

class Header {
    constructor(ctx = null, height = 40, yOffset = 0) {
        this.ctx = ctx
        this.yOffset = yOffset
        this.height = height
        this.colWidth = colWidth
        console.log("header is created")
    }

    display(yOffset) {
        this.ctx.strokeStyle = "grey"
        let xOffset = 0
        let ColName = 64
        for (let width of this.colWidth) {
            this.ctx.strokeRect(xOffset, yOffset, width, this.height)
            this.ctx.fillStyle = "grey"
            this.ctx.clearRect(xOffset+1, yOffset+1, width-2, this.height-2)
            this.ctx.fillStyle="black"
            this.ctx.fillText(ColName === 64 ? "" : String.fromCharCode(ColName), (2 * xOffset + width - 4) / 2, (2 * yOffset + this.height + 6) / 2)
            this.ctx.fillStyle = "grey"
            ColName++
            xOffset += width
        }
    }
}

export { Header }
