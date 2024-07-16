import { Grid } from "./Grid.js"
import { Header } from "./header.js"
import { Indexing } from "./indexing.js"
// import { listenScroll } from "./EventListener.js"

const canvas = document.createElement("canvas")
canvas.setAttribute("id", "canvas")
canvas.setAttribute("height", "4000")
canvas.setAttribute("width", "3150")
canvas.setAttribute("position", "absolute")
canvas.setAttribute("top", "0px")
document.body.appendChild(canvas)
const ctx = document.getElementById("canvas").getContext("2d")
var colWidth = new Array(27)
var rowHeight = new Array(100)
var header = new Header(ctx, 30, 0)  //context, rowHeight, yOffset
var indexing = new Indexing(ctx, 30)   // context, colWidth, xOffset
var grid = new Grid(ctx, 30, 30)   //context, xOffset, yOffset

colWidth.fill(130)
rowHeight.fill(30)
colWidth[0] = 30
ctx.font = "14px Arial"
ctx.strokeStyle = "grey"
ctx.fillStyle = "grey"
ctx.textBaseline = "alphabetic"



grid.display()
header.display(window.scrollY)
indexing.display()


window.addEventListener('scroll', (event) => {
    if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
        if (event.deltaX > 0) {
            console.log('Mouse wheel scrolled right inside the element.')
            console.log(window.scrollY)
        } else if (event.deltaX < 0) {
            console.log('Mouse wheel scrolled left inside the element.')
        }
    }
    ctx.clearRect(0, 0, 3150, 4000)
    grid.display()
    header.display(window.scrollY)
    indexing.display()
})
window.addEventListener('wheel', (event) => {
    ctx.clearRect(0, 0, 3150, 4000)
    grid.display()
    header.display(window.scrollY)
    indexing.display()
})

canvas.addEventListener('click', (event) => {
    var rect = canvas.getBoundingClientRect()
    ctx.clearRect(0, 0, 3150, 4000)
    const x = event.clientX-rect.left, y = event.clientY - rect.top
    grid.display()
    grid.drawSelectedCell(x, y)
    header.display(window.scrollY)
    indexing.display()
})

canvas.addEventListener('mousedown',()=>{
    console.log("down")
})

canvas.addEventListener('mousemove',()=>{
    console.log("move");
})

canvas.addEventListener('mouseup', ()=>{
    console.log("up");
})

canvas.addEventListener('drag', () => {
    console.log('drag event')
})

canvas.addEventListener('dragend', () => {
    console.log('dragend event')
})

canvas.addEventListener('dragenter', () => {
    console.log('dragenter event')
})

canvas.addEventListener('dragleave', () => {
    console.log('dragleave event')
})

canvas.addEventListener('dragover', () => {
    console.log('dragover event')
})

canvas.addEventListener('dragstart', () => {
    console.log('dragstart event')
})

export { colWidth, rowHeight }