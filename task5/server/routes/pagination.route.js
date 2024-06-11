const router = require("express").Router();
const paginationController = require("../controllers/paginationController");


router.post('/' , paginationController)

module.exports = router;
