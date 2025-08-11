const express = require('express');
const router = express.Router();

const rolegroupController = require('../controllers/rolegroupController');
const controller = new rolegroupController();

router.post('/newrolegroup', controller.newrolegroup.bind(controller));
router.put('/updaterolegroup', controller.updaterolegroup.bind(controller));
router.delete('/deleterolegroup', controller.deleterolegroup.bind(controller));
router.get('/getallrolegroup', controller.getallrolegroup.bind(controller))

module.exports = router;