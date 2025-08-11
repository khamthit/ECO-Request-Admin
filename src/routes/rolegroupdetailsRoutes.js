const express = require('express');
const router = express.Router();

const rolegroupdetailsController = require('../controllers/rolelgroupdetailsController');
const controller = new rolegroupdetailsController();

router.post('/newrolegroupdetails', controller.newrolegroupdetails.bind(controller));
router.get('/getAllRoleGroupDetails', controller.getAllRoleGroupDetails.bind(controller));
router.put('/updaterolegroupdetails', controller.updaterolegroupdetails.bind(controller));
router.delete('/deleterolegroupdetailsbyId', controller.deleterolegroupdetails.bind(controller));
router.delete('/deleterolegroupdetailsbyuserId', controller.deleterolegroupdetailsbyuserId.bind(controller));
router.get('/getrolegroupdetailsbyuserId', controller.getrolegroupdetailsbyuserId.bind(controller));


module.exports = router;
