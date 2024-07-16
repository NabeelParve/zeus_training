const listenScroll = (ctx = null) => {
    window.addEventListener('scroll', (event) => {
        console.log(event.deltaX)
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
}


export { listenScroll }