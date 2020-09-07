var express = require('express');
var router = express.Router();

// Require controllers
var index_controller = require('../controllers/indexController');

/* Home page controllers */
router.get('/', index_controller.index_page_get);

module.exports = router;