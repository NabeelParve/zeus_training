import { colWidth, fontSize } from "./main.js"

class Util {
    constructor() {

    }

    contains(cell, x, y) {
        return (cell.xOffset <= x) && (cell.yOffset <= y) && (cell.xOffset + cell.width >= x) && (cell.yOffset + cell.height >= y)
    }

    isSelected(x1, y1, x2, y2, x, y) {
        let startX = Math.min(x1,x2)
        let endX = x1+x2-startX
        let startY = Math.min(y1,y2)
        let endY = y1+y2-startY
        return x >= startX && x <= endX && y >= startY && y <= endY;
    }

    isNearBorder(x = 0){
        var current_width = 0
        for(var i = 0; i < colWidth.length; i++){
            current_width += colWidth[i]
            if(Math.abs(current_width-x)<=3) return true
        }
        return false
    }

    getWrapedText(text, width) {
        let textWidth = text.length * fontSize
        let wrappedText = text
        if (textWidth >= width) {
            wrappedText = text.substring(0, width / fontSize)+"..."
        }
        return wrappedText
    }
}


export { Util }