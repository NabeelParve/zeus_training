import { colWidth, rowHeight } from "./main.js"
import { Cell } from "./cell.js"

class Grid {
    constructor(ctx = null, xOffset = 0, yOffset = 0) {
        this.ctx = ctx
        this.xOffset = xOffset
        this.yOffset = yOffset
        this.Table = new Array(rowHeight.length)
    }


    display() {
        this.ctx.strokeStyle = "grey"
        let temp_xOffset = this.xOffset
        let temp_yOffset = this.yOffset
        for (let i = 0; i < rowHeight.length; i++) {
            this.Table[i] = new Array(colWidth.length)
            let height = rowHeight[i]
            for (let j = 1; j < colWidth.length; j++) {
                this.Table[i][j] = new Cell(temp_xOffset, temp_yOffset)
                let width = colWidth[j]
                this.ctx.strokeRect(temp_xOffset, temp_yOffset, width, height)
                this.ctx.fillText(temp_yOffset, (2 * temp_xOffset + width) / 2, (2 * temp_yOffset + height) / 2)
                temp_xOffset += width
            }
            temp_xOffset = 30
            temp_yOffset += height
        }
    }

    drawSelectedCell(x = 0, y = 0) {
        this.ctx.strokeStyle = "grey"
        let temp_xOffset = this.xOffset
        let temp_yOffset = this.yOffset
        for (let i = 0; i < rowHeight.length; i++) {
            let height = rowHeight[i]
            for (let j = 1; j < colWidth.length; j++) {
                let width = colWidth[j]
                if ((temp_xOffset < x) && (temp_yOffset < y) && (temp_xOffset + width >= x) && (temp_yOffset + height >= y)) {
                    this.ctx.fillRect(temp_xOffset+1, temp_yOffset+1, width - 2, height - 2)
                    this.ctx.strokeStyle = "blue"
                    this.ctx.fillStyle = "white"
                    this.ctx.strokeRect(temp_xOffset, temp_yOffset, width, height)
                    this.ctx.fillText(temp_yOffset, (2 * temp_xOffset + width) / 2, (2 * temp_yOffset + height) / 2)
                    return
                } 
                temp_xOffset += width
            }
            temp_xOffset = 30
            temp_yOffset += height
        }
        this.ctx.strokeStyle = "grey"
        this.ctx.fillStyle = "grey"
    }
}

export { Grid }