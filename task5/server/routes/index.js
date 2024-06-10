const uploadRoute = require('./upload.route')
const router = require('express').Router()

const routes = [
    {
        path : '/upload',
        route: uploadRoute
    }
]


routes.forEach((route)=>{
    router.use(route.path , route.route)

})

module.exports = router