import { Grid } from "./Grid.js"
import { Header } from "./header.js"
import { Indexing } from "./indexing.js"
import { Util } from "./util.js"
// import { listenScroll } from "./EventListener.js"

const canvas = document.createElement("canvas")
const canvasHeight = 4000
canvas.setAttribute("id", "canvas")
canvas.setAttribute("height", canvasHeight)
canvas.setAttribute("width", "3150")
canvas.setAttribute("position", "absolute")
canvas.setAttribute("top", "0px")
document.body.appendChild(canvas)
const ctx = document.getElementById("canvas").getContext("2d")
var colWidth = new Array(29)
var rowHeight = new Array(100)
const fontSize = 14;
var rect = canvas.getBoundingClientRect()
var helper = new Util()
var header = new Header(ctx, 30, 0)  //context, rowHeight, yOffset
var indexing = new Indexing(ctx, 30)   // context, colWidth, xOffset
var grid = new Grid(ctx, 30, 30 - 8)   //context, xOffset, yOffset

colWidth.fill(130)
rowHeight.fill(30)
colWidth[0] = 30
ctx.font = "14px Arial"
ctx.strokeStyle = "grey"
ctx.fillStyle = "grey"
ctx.textBaseline = "middle"
ctx.textAlign = "center"

grid.display()
header.display(window.scrollY - 8)
indexing.display()

window.addEventListener('scroll', (event) => {
    if (!grid.isSelecting) {
        ctx.clearRect(0, 0, 3150, 4000)
        grid.reDraw();
        header.display(window.scrollY - 8)
        indexing.display()
    }
})

window.addEventListener('wheel', (event) => {
    ctx.clearRect(0, 0, 3150, 4000)
    grid.reDraw();
    header.display(window.scrollY - 8)
    indexing.display()
})

canvas.addEventListener("dblclick", (event) => {
    const x = event.clientX - rect.left, y = event.clientY - rect.top
    ctx.clearRect(0, 0, 3150, 4000)
    grid.reDraw();
    grid.drawEditedCell(x, y)
    header.display(window.scrollY - 8)
    indexing.display()
})

canvas.addEventListener('mousedown', (event) => {
    if (event.clientY < 30) {
        if (helper.isNearBorder(event.clientX-rect.left)) {
            canvas.style.cursor = "col-resize"
            grid.resizeColumnStart(event.clientX-rect.left)
            ctx.clearRect(0, 0, 3150, 4000)
            grid.reDraw()
            header.display(window.scrollY - 8)
            indexing.display()
        }
        grid.selectColumn(event.clientX - rect.left, event.clientY - rect.top)
        ctx.clearRect(0, 0, 3150, 4000)
        grid.reDraw()
        header.display(window.scrollY - 8)
        indexing.display()
    }
    else {
        const x = event.clientX - rect.left, y = event.clientY - rect.top
        grid.startSelection(x, y)
    }
})

canvas.addEventListener('mousemove', (event) => {
    if (grid.isResizing) {
        grid.resizeColumnUpdate(event.clientX-rect.left)
        ctx.clearRect(0, 0, 3150, 4000)
        grid.reDraw()
        header.display(window.scrollY - 8)
        indexing.display()
        // grid.drawVirtualLine(event.clientX)
    }
    if (grid.isSelecting) {
        const x = event.clientX - rect.left, y = event.clientY - rect.top
        grid.updateSelection(x, y)
        ctx.clearRect(0, 0, 3150, 4000)
        grid.reDraw()
        header.display(window.scrollY - 8)
        indexing.display()
    }
})

canvas.addEventListener('mouseup', (event) => {
    if (grid.isResizing) {
        grid.resizeColumnEnd(event.clientX-rect.left)
        ctx.clearRect(0, 0, 3150, 4000)
        grid.reDraw()
        header.display(window.scrollY - 8)
        indexing.display()
        canvas.style.cursor = "default"
    }
    if (event.clientY < 30) {
        grid.selectColumn(event.clientX - rect.left, event.clientY - rect.top)
        ctx.clearRect(0, 0, 3150, 4000)
        grid.reDraw()
        header.display(window.scrollY - 8)
        indexing.display()
    }
    else {
        const x = event.clientX - rect.left, y = event.clientY - rect.top
        grid.endSelection(x, y)
        ctx.clearRect(0, 0, 3150, 4000)
        grid.reDraw()
        header.display(window.scrollY - 8)
        indexing.display()
    }
})

window.addEventListener("keydown", (event) => {
    let x = event.pageX - rect.left, y = event.pageY - rect.top
    grid.navigate(x, y, event.key)
    ctx.clearRect(0, 0, 3150, 4000)
    grid.reDraw()
    header.display(window.scrollY)
    indexing.display()
})

window.addEventListener('load',grid.loadData)

export { colWidth, rowHeight, fontSize }