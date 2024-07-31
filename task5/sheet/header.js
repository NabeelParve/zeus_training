import { colWidth, headerHeight } from "./main.js"

class Header {
    constructor(ctx = null, xOffset = 0, yOffset = 0) {
        this.ctx = ctx
        this.yOffset = yOffset
        this.xOffset = xOffset
        this.colWidth = colWidth
    }

    display(yOffset) {
        this.ctx.strokeStyle = "rgb(196,199,197)"
        let xOffset = this.xOffset
        let ColName = 64
        for (let width of this.colWidth) {
            this.ctx.strokeRect(xOffset, yOffset, width, headerHeight)
            this.ctx.fillStyle = "rgb(196,199,197)"
            this.ctx.clearRect(xOffset+1, yOffset+1, width-2, headerHeight-2)
            this.ctx.fillStyle="black"
            this.ctx.fillText(ColName === 64 ? "" : String.fromCharCode(ColName), (2 * xOffset + width - 4) / 2, (2 * yOffset + headerHeight + 6) / 2)
            this.ctx.fillStyle = "rgb(196,199,197)"
            ColName++
            xOffset += width
        }
    }
}

export { Header }
