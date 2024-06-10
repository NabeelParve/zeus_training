const router = require('express').Router()
const uploadController = require('../controllers/uploadController')
const uploads = require('../utils/multer')

router.post('/' ,uploads.single("file"),  uploadController)



module.exports = router