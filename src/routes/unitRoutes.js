const express = require('express');
const router = express.Router();

const unitController = require('../controllers/unitController');
const controller = new unitController();

router.post('/createUnit', controller.newunit.bind(controller));
router.put('/updateUnit', controller.updateunit.bind(controller));
router.get('/getData', controller.getunitall.bind(controller));
router.delete('/deleteUnit', controller.delete.bind(controller));

module.exports = router;