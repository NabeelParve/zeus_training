import { colWidth, rowHeight, indexingWidth, headerHeight } from "./main.js"
import { Cell } from "./cell.js"
import { Util } from "./util.js"

class Grid {
    constructor(parentElement, xOffset = 0, yOffset = 0) {
        this.canvas = document.createElement("canvas");
        this.canvas.style.width = window.innerWidth
        this.canvas.style.height = window.innerHeight
        if (parentElement) parentElement.appendChild(this.canvas);
        this.ctx = this.canvas.getContext("2d")
        this.canvasHeight = window.innerHeight
        let scale = window.devicePixelRatio
        this.canvasWidth = window.innerWidth
        this.canvas.height = window.innerHeight * scale
        this.canvas.width = window.innerWidth * scale
        this.xOffset = xOffset
        this.yOffset = yOffset
        this.Table = new Array(rowHeight.length).fill(null).map(() =>
            new Array(colWidth.length).fill(null).map(() => new Cell(""))
        );
        this.helper = new Util()
        this.isResizing = false
        this.selectedStartX = -1
        this.selectedStartY = -1
        this.selectedEndY = -1
        this.selectedEndX = -1
        this.isSelecting = false
        this.isEditing = false
        this.isSelected = false;
        this.resizeStart = -1
        this.resizeEnd = -1
        this.resizeColumnIndex = -1
        this.selectedCell = [-1, -1]
        this.scrollY = 0
        this.startRow = 0
        this.busy = null
        this.navigationMap = {
            "ArrowUp": [-1, 0],
            "ArrowLeft": [0, -1],
            "ArrowRight": [0, 1],
            "ArrowDown": [1, 0]
        }
        this.ctx.font = "14px Arial"
        this.ctx.strokeStyle = "grey"
        this.ctx.fillStyle = "grey"
        this.ctx.textBaseline = "middle"
        this.ctx.textAlign = "center"
        this.sum = 0
    }

    resize() {
        let scale = window.devicePixelRatio;
        this.canvas.height = window.innerHeight * scale
        this.canvas.width = window.innerWidth * scale
        this.canvas.style.width = window.innerWidth
        this.canvas.style.height = window.innerHeight
        this.ctx = this.canvas.getContext("2d")
        this.canvasHeight = window.innerHeight
        this.canvasWidth = window.innerWidth
        this.ctx.scale(scale, scale);
    }

    showHeader() {
        let temp_xOffset = indexingWidth
        let temp_yOffset = 0
        let ColName = 65
        let start = Math.min(this.selectedStartY, this.selectedEndY)
        let end = this.selectedStartY + this.selectedEndY - start
        for (var i = 0; i < colWidth.length; i++) {
            if (start <= i && end >= i || this.selectedCell[1] == i) {
                this.ctx.fillStyle = "rgba(0,120,215,0.3)"
                this.ctx.fillRect(temp_xOffset + 1, temp_yOffset + 1, colWidth[i] - 1, headerHeight - 1)
            }
            this.ctx.fillStyle = "black"
            this.ctx.fillText(String.fromCharCode(ColName++), (2 * temp_xOffset + colWidth[i]) / 2, (2 * temp_yOffset + headerHeight) / 2)
            temp_xOffset += colWidth[i]
        }
    }

    showIndexing() {
        let temp_xOffset = 0
        let temp_yOffset = headerHeight
        let ColName = this.startRow + 1
        let start = Math.min(this.selectedStartX, this.selectedEndX)
        let end = this.selectedStartX + this.selectedEndX - start
        for (var i = this.startRow; i < rowHeight.length; i++) {
            if (start <= i && end >= i || this.selectedCell[0] == i) {
                this.ctx.fillStyle = "rgba(0,120,215,0.3)"
                this.ctx.fillRect(temp_xOffset + 1, temp_yOffset + 1, indexingWidth - 1, rowHeight[i] - 1)
            }
            this.ctx.fillStyle = "black"
            this.ctx.fillText(ColName++, (2 * temp_xOffset + indexingWidth) / 2, (2 * temp_yOffset + rowHeight[i]) / 2)
            temp_yOffset += rowHeight[i]
        }
    }

    drawSelectedCell(i = -1, j = -1, xOffset, yOffset, width, height, border = false) {
        if (i < 0 || j < 0) return
        this.ctx.strokeStyle = "rgb(14, 101, 235)"
        this.ctx.fillStyle = "rgba(0,120,215,0.3)"
        let cell = this.Table[i][j]
        this.ctx.fillRect(xOffset, yOffset, width, height)
        if (border) {
            this.ctx.strokeRect(xOffset + 1, yOffset + 1, width - 1, height - 1)
        }

        this.ctx.fillStyle = "black"
        this.ctx.fillText(this.helper.getWrapedText(cell.text, width), (2 * xOffset + width) / 2, (2 * yOffset + height) / 2)
        this.ctx.strokeStyle = "rgb(196,199,197)"
    }

    appendRows(){
        for(var i = 0;i < 50; i++){
            rowHeight.push(30)
            this.Table.push(new Array(colWidth.length).fill(null).map(() => new Cell("")))
        }
    }

    reDraw_internal() {
        if(this.startRow + 50 >= this.Table.length){
            this.appendRows()
        }
        this.ctx.strokeStyle = "rgb(196,199,197)"
        let temp_xOffset = this.xOffset
        let temp_yOffset = this.yOffset
        this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
        for (let i = this.startRow; i < rowHeight.length; i++) {
            let height = rowHeight[i]
            this.ctx.beginPath()
            this.ctx.moveTo(0, temp_yOffset + 0.5);
            this.ctx.lineTo(this.canvasWidth, temp_yOffset + 0.5);
            this.ctx.stroke();
            temp_yOffset += height
        }
        for (let j = 0; j < colWidth.length; j++) {
            let width = colWidth[j]
            this.ctx.beginPath()
            this.ctx.moveTo(temp_xOffset + 0.5, 0);
            this.ctx.lineTo(temp_xOffset + 0.5, this.canvasHeight);
            this.ctx.stroke();
            temp_xOffset += width
        }
        this.showHeader()
        this.showIndexing()
        temp_xOffset = indexingWidth
        temp_yOffset = headerHeight
        let firstSelectedCell = true
        for (let i = this.startRow; i < rowHeight.length; i++) {
            let height = rowHeight[i]
            for (let j = 0; j < colWidth.length; j++) {
                let width = colWidth[j]
                let cell = this.Table[i][j]
                if (this.helper.isSelected(this.selectedStartX, this.selectedStartY, this.selectedEndX, this.selectedEndY, i, j) || (this.selectedCell[0] == i && this.selectedCell[1] == j)) {
                    this.drawSelectedCell(i, j, temp_xOffset, temp_yOffset, width, height, firstSelectedCell)
                    firstSelectedCell = false
                }
                else {
                    this.ctx.fillText(this.helper.getWrapedText(this.Table[i][j].text, width), (2 * temp_xOffset + colWidth[j]) / 2, (2 * temp_yOffset + rowHeight[i]) / 2)
                }
                temp_xOffset += width
            }
            temp_xOffset = indexingWidth
            temp_yOffset += height
        }
    }

    reDraw() {
        this.ctx = this.canvas.getContext("2d")

        if (this.busy)
            return;

        this.busy = requestAnimationFrame(() => {
            this.busy = null
            this.reDraw_internal()
        })
    }

    getPosition(x, y) {
        let temp_xOffset = this.xOffset
        let temp_yOffset = this.yOffset
        for (let i = this.startRow; i < rowHeight.length; i++) {
            let height = rowHeight[i]
            for (let j = 0; j < colWidth.length; j++) {
                let width = colWidth[j]
                if (this.helper.contains(temp_xOffset, temp_yOffset, width, height, x, y)) return { i, j }
                temp_xOffset += width
            }
            temp_xOffset = indexingWidth
            temp_yOffset += height
        }
        return { i: -1, j: -1 }
    }

    getColumn(x) {
        var temp = indexingWidth;
        for (var j = 0; j < colWidth.length; j++) {
            let height = colWidth[j]
            temp += height
            if (Math.abs(temp - x) <= 5) return j
        }
        return -1
    }
    getColumnForSelection(x) {
        var temp = indexingWidth;
        for (var j = 0; j < colWidth.length; j++) {
            let height = colWidth[j]
            temp += height
            if (temp >= x) return j
        }
        return -1
    }

    getRow(y) {
        var temp = headerHeight;
        for (var i = this.startRow; i < rowHeight.length; i++) {
            let height = colWidth[i]
            temp += height
            if (Math.abs(temp - y) <= 5) return i
        }
        return -1
    }
    getRowForSelection(y) {
        var temp = headerHeight
        for (var i = this.startRow; i < rowHeight.length; i++) {
            let height = rowHeight[i]
            temp += height
            if (temp >= y) return i
        }
        return -1
    }

    getOffsets(row, col) {
        let temp_xOffset = this.xOffset
        let temp_yOffset = this.yOffset
        for (let i = this.startRow; i < rowHeight.length; i++) {
            let height = rowHeight[i]
            for (let j = 0; j < colWidth.length; j++) {
                let width = colWidth[j]
                if (i == row && j == col) return { xOffset: temp_xOffset, yOffset: temp_yOffset }
                temp_xOffset += width
            }
            temp_xOffset = indexingWidth
            temp_yOffset += height
        }
        return { xOffset: -1, yOffset: -1 }
    }

    drawEditedCell(x, y) {
        this.isEditing = true;
        this.ctx.fillStyle = "rgb(196,199,197)"
        let { i, j } = this.getPosition(x, y)
        if (i < 0 || j < 0) return
        const cell = this.Table[i][j]
        let { xOffset, yOffset } = this.getOffsets(i, j)
        const input = document.createElement("input");
        input.type = "text";
        input.value = cell.text
        input.style.position = "absolute";
        input.style.fontSize = "14px"
        input.style.left = `${xOffset + 1}px`;
        input.style.top = `${yOffset + 1}px`;
        input.style.width = `${(colWidth[j] - 2)}px`;
        input.style.height = `${(rowHeight[i] - 2)}px`;
        input.style.fontSize = "12px";
        input.style.outline = "blue"
        input.style.border = "1px solid #rgb(221,221,221)";
        input.style.boxSizing = "border-box";
        input.addEventListener("blur", () => {
            this.Table[i][j].text = input.value;
            document.body.removeChild(input);
            this.isEditing = false

        });
        document.body.appendChild(input);
        input.focus();
        input.select();
    }

    startSelection(x = 0, y = 0) {
        this.isSelected = true
        this.isSelecting = true
        let { i, j } = this.getPosition(x, y)
        this.selectedCell = [i, j]
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
        this.selectedCell[0] += this.navigationMap[keyCode][0]
        this.selectedCell[1] += this.navigationMap[keyCode][1]
        this.selectedStartX = this.selectedCell[0]
        this.selectedStartY = this.selectedCell[1]
        this.selectedEndX = this.selectedCell[0]
        this.selectedEndY = this.selectedCell[1]
    }

    selectColumnStart(x = 0, y = 0) {
        let j = this.getColumnForSelection(x)
        this.isSelecting = true;
        if (j < 0) return
        this.selectedStartX = 0
        this.selectedStartY = j
        this.selectedEndX = rowHeight.length
        this.selectedEndY = j
        this.selectedCell[0] = -1
        this.selectedCell[1] = -1

    }
    selectColumnUpdate(x = 0, y = 0) {
        let j = this.getColumnForSelection(x)
        if (j < 0) return
        this.selectedEndY = j
        this.selectedCell[0] = -1
        this.selectedCell[1] = -1

    }
    selectColumnEnd(x = 0, y = 0) {
        let j = this.getColumnForSelection(x)
        if (j < 0) return
        this.selectedEndY = j
        this.selectedCell[0] = -1
        this.selectedCell[1] = -1
        this.isSelecting = false;

    }

    selectRowStart(x = 0, y = 0) {
        this.isSelecting = true
        let i = this.getRowForSelection(y)
        if (i < 0) return
        this.selectedStartX = i
        this.selectedStartY = 0
        this.selectedEndX = i
        this.selectedEndY = colWidth.length
        this.selectedCell[0] = -1
        this.selectedCell[1] = -1
    }

    selectRowUpdate(x = 0, y = 0) {
        let i = this.getRowForSelection(y)
        if (i < 0) return
        this.selectedEndX = i
        this.selectedCell[0] = -1
        this.selectedCell[1] = -1
    }

    selectRowEnd(x = 0, y = 0) {
        let i = this.getRowForSelection(y)
        if (i < 0) return
        this.selectedEndX = i
        this.isSelecting = false
    }

    resizeColumnStart(x) {
        this.isResizing = true
        this.resizeStart = x
        let j = this.getColumn(this.resizeStart)
        this.initialWidth = colWidth[j]
        this.resizeColumnIndex = j
    }

    resizeColumnUpdate(x) {
        this.resizeEnd = x
        if (this.initialWidth + this.resizeEnd - this.resizeStart > 30)
            colWidth[this.resizeColumnIndex] = this.initialWidth + this.resizeEnd - this.resizeStart
    }

    resizeColumnEnd(x) {
        this.resizeEnd = x
        if (this.initialWidth + this.resizeEnd - this.resizeStart > 30)
            colWidth[this.resizeColumnIndex] = this.initialWidth + this.resizeEnd - this.resizeStart
        this.isResizing = false;
        this.resizeStart = -1
        this.resizeColumnIndex = -1
        this.resizeEnd = -1
    }


    resizeRowStart(y) {
        this.isResizing = true
        this.resizeStart = y
        let i = this.getRow(this.resizeStart)
        this.initialWidth = rowHeight[i]
        this.resizeColumnIndex = i
    }

    resizeRowUpdate(y) {
        this.resizeEnd = y
        if (this.initialWidth + this.resizeEnd - this.resizeStart > 20)
            rowHeight[this.resizeColumnIndex] = this.initialWidth + this.resizeEnd - this.resizeStart
    }

    resizeRowEnd(x) {
        this.resizeEnd = x
        if (this.initialWidth + this.resizeEnd - this.resizeStart > 20)
            colWidth[this.resizeColumnIndex] = this.initialWidth + this.resizeEnd - this.resizeStart
        this.isResizing = false;
        this.resizeStart = -1
        this.resizeColumnIndex = -1
        this.resizeEnd = -1
    }


    scroll(x, y) {
        let temp_yOffset = headerHeight
        this.scrollY += y
        this.scrollY = Math.max(0, this.scrollY)
        for (var i = 0; i < rowHeight.length; i++) {
            temp_yOffset += rowHeight[i]
            if (temp_yOffset > this.scrollY) {
                this.startRow = i
                break
            }
        }
    }

    async loadData() {
        let url = "http://localhost:5088/api/user/0";
        try {
            const response = await fetch(url, {
                method: "GET"
            });
            var data = await response.json();
            data = data.data
            for (var i = 0; i < data.length; i++) {
                var j = 0
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
        }
        catch (error) {
            console.log(error);
        }
    }
}
export { Grid }