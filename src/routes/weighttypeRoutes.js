const express = require('express');
const router = express.Router();

const weighttypeController = require('../controllers/weighttypeController');
const controller = new weighttypeController();

router.post('/newweighttype', controller.newweighttype.bind(controller));
router.put('/updateweighttype', controller.updateweighttype.bind(controller));
router.delete('/deleteweighttype', controller.deleteweighttype.bind(controller));
router.get('/getData', controller.getweighttypeall.bind(controller));

module.exports = router;