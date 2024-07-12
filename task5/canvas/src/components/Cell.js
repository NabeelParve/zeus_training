import React, { useRef, useEffect } from 'react'

function Cell({ startX, startY, height, width }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.strokeStyle = "blue";
        ctx.font = "24px Arial";
        ctx.textBaseline = "alphabetic";
        ctx.strokeRect(startX, startY, width, height);
        ctx.clearRect(startX+1, startY+1, width-2 , height-2);
        ctx.fillText("Hello World", 70, 100);

    },);
    return (
        <canvas ref={canvasRef} width={120} height={160}/>
    )
}

export default Cell