const express = require('express');
const router = express.Router();
const laohscodeController = require('../controllers/laohscodeController');
const controller = new laohscodeController();

router.post('/newlaohscode', controller.newlaohscode.bind(controller)); 
router.put('/updatelaohscode', controller.updatelaohscode.bind(controller));
router.delete('/deletelaohscode', controller.deletelaohscode.bind(controller));
router.get('/getlaohscode', controller.getlaohscode.bind(controller));

module.exports = router;