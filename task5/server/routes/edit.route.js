const router = require("express").Router();
const {deleteController, insertController} = require('../controllers/editController')


router.delete('/' , deleteController)
router.post('/' , insertController)

module.exports = router;
