const {Router} = require('express');
const router = Router();
const AFDController = require('./controller/AFDController');

router.post('/afd', AFDController.afdFunction);

module.exports = router;