import { Grid } from "./grid.js"
import { Util } from "./util.js"

const headerHeight = 30
const indexingWidth = 30
const cellWidth = 130;
const cellHeight = 30;
var colWidth = new Array(26)
var rowHeight = new Array(100)
const fontSize = 14;
var helper = new Util()
var grid = new Grid(document.body, indexingWidth, headerHeight)
colWidth.fill(cellWidth)
rowHeight.fill(cellHeight)

function main() {
    // grid.loadData()
    grid.reDraw()
}
main()

window.addEventListener('resize', () => {
    grid.resize();
    grid.reDraw()
})

window.addEventListener("wheel", (event) => {
    console.log(event.deltaX, event.deltaY);
    grid.scroll(event.deltaX, event.deltaY)
    grid.reDraw()
})

window.addEventListener("scroll", () => {
    console.log("Scroll");
})

window.addEventListener("dblclick", (event) => {
    const x = event.clientX, y = event.clientY
    grid.drawEditedCell(x, y)
    grid.reDraw()
})

window.addEventListener('pointerdown', (event) => {
    const x = event.clientX, y = event.clientY
    if (event.clientY < 30) {
        if (helper.isNearBorder(x)) {
            document.body.style.cursor = "col-resize"
            grid.resizeColumnStart(x)
        }
        else {
            grid.selectColumnStart(x, y)
        }
        grid.reDraw()
    } else if (event.clientX < 30) {
        if (helper.isNearBorder(x)) {
            document.body.style.cursor = "row-resize"
            grid.resizeRowStart(x)
        }
        else {
            grid.selectRowStart(x, y)
        }
        grid.reDraw()
    }
    else {
        grid.startSelection(x, y)
    }
})

window.addEventListener('pointermove', (event) => {
    const x = event.clientX, y = event.clientY
    if (grid.isResizing) {
        grid.resizeColumnUpdate(x)
        grid.reDraw()
    }
    else if(grid.isSelecting && event.clientY < 30){
        grid.selectColumnUpdate(x,y)
        grid.reDraw()
    }
    else if(grid.isSelecting && event.clientX < 30){
        grid.selectRowUpdate(x,y)
        grid.reDraw()
    }
    else if (grid.isSelecting) {
        grid.updateSelection(x, y)
        grid.reDraw()
    }
})

window.addEventListener('pointerup', (event) => {
    if (grid.isResizing) {
        grid.resizeColumnEnd(event.clientX)
        grid.reDraw()
        document.body.style.cursor = "default"
    }
    else if (event.clientY < 30) {
        grid.selectColumnEnd(event.clientX, event.clientY)
        grid.reDraw()
    }
    else  if (event.clientX < 30) {
        grid.selectRowEnd(event.clientX, event.clientY)
        grid.reDraw()
    }
    else {
        const x = event.clientX, y = event.clientY
        grid.endSelection(x, y)
        grid.reDraw()
    }
})

window.addEventListener("keydown", (event) => {
    let x = event.pageX, y = event.pageY
    if (!grid.isEditing) {
        grid.navigate(x, y, event.key)
        grid.reDraw()
    }
})
export { colWidth, rowHeight, fontSize, indexingWidth, headerHeight }