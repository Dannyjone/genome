var express = require('express');
var router = express.Router();
const user = require('../mongodb/controllers/user')

router.param('id', user.load);
router.get('/user', user.list);
router.get('/user/checkID', user.checkID);
router.post('/user', user.create);
router.post('/user/checklogin', user.checklogin);
router.post('/user/:id', user.update);
router.delete('/user/:id', user.delete);

/******************************************/
module.exports = router;
