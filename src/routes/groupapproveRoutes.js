const express = require('express');
const router = express.Router();

const groupapproveController = require('../controllers/groupapproveController');
const controller = new groupapproveController();

router.post('/createnewapprove', controller.createnewapprove.bind(controller));
router.put('/updategroupapprove', controller.updategroupapprove.bind(controller));
router.delete('/deletegroupapprove', controller.deletegroupapprove.bind(controller));
router.get('/getapprovegroup', controller.getapprovegroup.bind(controller));

module.exports = router;
