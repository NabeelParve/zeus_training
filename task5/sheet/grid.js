import { colWidth, rowHeight } from "./main.js"
import { Cell } from "./cell.js"
import { Util } from "./util.js"

class Grid {
    constructor(ctx = null, xOffset = 0, yOffset = 0) {
        this.ctx = ctx
        this.xOffset = xOffset
        this.yOffset = yOffset
        this.Table = new Array(rowHeight.length)
        this.helper = new Util()
        this.isResizing = false
        this.selectedStartX = -1
        this.selectedStartY = -1
        this.selectedEndY = -1
        this.selectedEndX = -1
        this.isSelecting = false
        this.isSelected = false;
        this.resizeStart = -1
        this.resizeEnd = -1
        this.selectedCell = [-1, -1]
        this.navigationMap = {
            "ArrowUp": [-1, 0],
            "ArrowLeft": [0, -1],
            "ArrowRight": [0, 1],
            "ArrowDown": [1, 0]
        }
        this.sum = 0
    }

    async display() {
        this.ctx.strokeStyle = "rgb(196,199,197)"
        let temp_xOffset = this.xOffset
        let temp_yOffset = this.yOffset
        for (let i = 0; i < rowHeight.length; i++) {
            this.Table[i] = new Array(colWidth.length)
            let height = rowHeight[i]
            for (let j = 1; j < colWidth.length; j++) {
                let width = colWidth[j]
                this.Table[i][j] = new Cell(temp_xOffset, temp_yOffset, height, width, "")
                let cell = this.Table[i][j]
                this.ctx.strokeRect(temp_xOffset, temp_yOffset, width, height)
                this.ctx.fillText(this.helper.getWrapedText(cell.text, cell.width), (2 * cell.xOffset + width) / 2, (2 * cell.yOffset + height) / 2)
                temp_xOffset += width
            }
            temp_xOffset = 30
            temp_yOffset += height
        }
        await this.loadData()
    }

    drawSelectedCell(i = -1, j = -1, border = false) {
        if (i < 0 || j < 0) return
        this.ctx.strokeStyle = "rgb(196,199,197)"
        this.ctx.fillStyle = "rgba(0,120,215,0.3)"
        let cell = this.Table[i][j]
        this.ctx.fillRect(cell.xOffset + 1, cell.yOffset + 1, cell.width - 2, cell.height - 2)
        if (border) {
            this.ctx.strokeStyle = "blue"
            this.ctx.strokeRect(cell.xOffset, cell.yOffset, cell.width, cell.height)
        }
        this.ctx.fillStyle = "black"
        this.ctx.strokeRect(cell.xOffset, cell.yOffset, cell.width, cell.height)
        this.ctx.fillText(this.helper.getWrapedText(cell.text, cell.width), (2 * cell.xOffset + cell.width) / 2, (2 * cell.yOffset + cell.height) / 2)
        this.ctx.strokeStyle = "rgb(196,199,197)"
    }

    reDraw() {
        this.ctx.strokeStyle = "rgb(196,199,197)"
        let temp_xOffset = this.xOffset
        let temp_yOffset = this.yOffset
        let firstSelectedCell = true
        this.sum = 0
        for (let i = 0; i < rowHeight.length; i++) {
            let height = rowHeight[i]
            for (let j = 1; j < colWidth.length; j++) {
                let cell = this.Table[i][j];
                let width = colWidth[j]
                this.Table[i][j] = { ...cell, height: rowHeight[i], width: colWidth[j], xOffset: temp_xOffset, yOffset: temp_yOffset }
                if (this.helper.isSelected(this.selectedStartX, this.selectedStartY, this.selectedEndX, this.selectedEndY, i, j) || (this.selectedCell[0] == i && this.selectedCell[1] == j)) {
                    this.drawSelectedCell(i, j, firstSelectedCell)
                    firstSelectedCell = false
                    this.sum += Number(cell.text) ? Number(cell.text) : 0
                }
                else {
                    this.ctx.strokeRect(cell.xOffset, cell.yOffset, width, height)
                    this.ctx.fillText(this.helper.getWrapedText(cell.text, width), (2 * cell.xOffset + width) / 2, (2 * cell.yOffset + height) / 2)
                }
                temp_xOffset += width
            }
            temp_xOffset = 30
            temp_yOffset += height
        }
    }

    getPosition(x, y) {
        let temp_xOffset = this.xOffset
        let temp_yOffset = this.yOffset
        for (let i = 0; i < rowHeight.length; i++) {
            let height = rowHeight[i]
            for (let j = 1; j < colWidth.length; j++) {
                if (this.helper.contains(this.Table[i][j], x, y)) return { i, j }
            }
        }
        return { i: -1, j: -1 }
    }

    getColumn(x) {
        var temp = colWidth[0];
        for (var j = 1; j < colWidth.length; j++) {
            let height = colWidth[j]
            temp += height
            if (temp >= x) return j-1
        }
        return -1
    }

    drawEditedCell(x, y) {
        let temp_xOffset = this.xOffset
        let temp_yOffset = this.yOffset
        let { i, j } = this.getPosition(x, y)
        const cell = this.Table[i][j]
        const input = document.createElement("input");
        input.type = "text";
        input.value = cell.text
        input.style.position = "absolute";
        input.style.left = `${cell.xOffset + 9}px`;
        input.style.top = `${cell.yOffset + 9}px`;
        input.style.width = `${cell.width - 2}px`;
        input.style.height = `${cell.height - 2}px`;
        input.style.fontSize = "12px";
        input.style.border = "1px solid #rgb(221,221,221)";

        input.style.boxSizing = "border-box";

        input.addEventListener("blur", () => {
            this.Table[i][j].text = input.value;
            document.body.removeChild(input);
        });
        document.body.appendChild(input);
        input.focus();
        input.select();
    }

    startSelection(x = 0, y = 0) {
        this.isSelected = true
        let { i, j } = this.getPosition(x, y)
        this.selectedCell = [i, j]
        this.isSelecting = true
        this.selectedStartX = i
        this.selectedStartY = j
    }

    updateSelection(x = 0, y = 0) {
        let { i, j } = this.getPosition(x, y)
        if (this.isSelecting) {
            this.selectedEndX = i
            this.selectedEndY = j
        }
    }

    endSelection(x = 0, y = 0) {
        let { i, j } = this.getPosition(x, y)
        this.selectedEndX = i
        this.selectedEndY = j
        this.isSelecting = false
    }

    navigate(x = 0, y = 0, keyCode) {
        if (!this.isSelected) return
        let i = this.selectedCell[0], j = this.selectedCell[1]
        this.selectedCell[0] += this.navigationMap[keyCode][0]
        this.selectedCell[1] += this.navigationMap[keyCode][1]
        this.selectedStartX = this.selectedCell[0]
        this.selectedStartY = this.selectedCell[1]
        this.selectedEndX = this.selectedCell[0]
        this.selectedEndY = this.selectedCell[1]
    }

    selectColumn(x = 0, y = 0) {
        let j = this.getColumn(x)
        if (j < 0) return
        let width = colWidth[j]
        this.selectedStartX = 0
        this.selectedStartY = j + 1
        this.selectedEndX = rowHeight.length
        this.selectedEndY = j + 1
        this.selectedCell[0] = -1
        this.selectedCell[1] = -1

    }

    drawVirtualLine(x) {
        this.ctx.moveTo(x, 0);
        this.ctx.lineTo(x, 1000);
        this.ctx.stroke();
    }

    resizeColumnStart(x) {
        this.isResizing = true
        this.resizeStart = x
    }

    resizeColumnUpdate(x) {
        this.resizeEnd = x
    }

    resizeColumnEnd(x) {
        this.resizeEnd = x
        let j = this.getColumn(this.resizeStart)
        if (colWidth[j] + this.resizeEnd - this.resizeStart > 30)
            colWidth[j] = colWidth[j] + this.resizeEnd - this.resizeStart
        this.isResizing = false;
        this.resizeStart = -1
        this.resizeEnd = -1
    }

    async loadData() {
        let url = "http://localhost:5088/api/user/0";
        try {
            const response = await fetch(url, {
                method: "GET"
            });
            var data = await response.json();
            data = data.data
            console.log(data)
            for (var i = 0; i < data.length; i++) {
                var j = 1
                this.Table[i][j++].text = data[i].userId
                this.Table[i][j++].text = data[i].email
                this.Table[i][j++].text = data[i].name
                this.Table[i][j++].text = data[i].country
                this.Table[i][j++].text = data[i].city
                this.Table[i][j++].text = data[i].state
                this.Table[i][j++].text = data[i].telephoneNumber
                this.Table[i][j++].text = data[i].dateOfBirth
                this.Table[i][j++].text = data[i].addressLine1
                this.Table[i][j++].text = data[i].addressLine2
                for (var salary of data[i].salaries) {
                    this.Table[i][j++].text = salary.amount
                }

            }
            console.log(this.Table);
        }
        catch (error) {
            console.log(error);
        }
    }
}
export { Grid }