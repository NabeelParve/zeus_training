const router = require('express').Router()
const uploadRoute = require('./upload.route')
const paginationRoute = require('./pagination.route')
const editRoute = require('./edit.route')

const routes = [
    {
        path : '/upload',
        route: uploadRoute
    },
    {
        path : '/edit',
        route : editRoute
    },
    {
        path : '/page',
        route : paginationRoute
    }
]


routes.forEach((route)=>{
    router.use(route.path , route.route)

})

module.exports = router