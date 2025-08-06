const express = require('express');
const router = express.Router();

const formtypeController = require('../controllers/formtypeController');
const controller = new formtypeController();

router.get('/getData', controller.getAllformtype.bind(controller));
router.post('/newFormtype', controller.newformtype.bind(controller));
router.put('/updateFormtype', controller.updateformtype.bind(controller));
router.delete('/deleteFormtype', controller.deleteformtype.bind(controller));

module.exports = router;
