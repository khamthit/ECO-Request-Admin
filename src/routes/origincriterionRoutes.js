const express = require('express');
const router = express.Router();

const origincriterionController = require('../controllers/origincriterionController');
const controller = new origincriterionController();

router.post('/neworigincriterion', controller.neworigincriterion.bind(controller));
router.put('/updateorigincriterion', controller.updateorigincriterion.bind(controller));
router.delete('/deleteorigincriterion', controller.deleteorigincriterion.bind(controller));
router.get('/getorigincriterion', controller.getAllOriginCriteria.bind(controller));
module.exports = router;