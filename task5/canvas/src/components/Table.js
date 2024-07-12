import React, { useEffect, useRef } from 'react'

function Table() {
    const canvasRef = useRef(null);
    const height = 40, width = 120
    useEffect(() => {
        var startX = 0, startY = 0
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.strokeStyle = "blue";
        ctx.font = "24px Arial";
        ctx.textBaseline = "alphabetic";
        for (var i = 0; i < 14; i++) {
            for (var j = 0; j < 14; j++) {
                ctx.strokeRect(startX, startY, width, height);
                ctx.clearRect(startX + 1, startY + 1, width - 2, height - 2);
                ctx.fillText("Hello World", startX+20, startY+30);
                startX+=width
            }
            startX=0
            startY+=height
        }
    },);

    return (
        <canvas ref={canvasRef} width={1700} height={800} />
    )
}

export default Table