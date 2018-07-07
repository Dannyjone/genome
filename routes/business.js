var express = require('express');
var router = express.Router();
const business = require('../mongodb/business/business')
const USER_BUSINESS = require('../mongodb/business/Users_Business.js')

/***************************************************************************************/
/*用户相关业务***************************************************************************/
/***************************************************************************************/
router.post("/Login", USER_BUSINESS.Login)
router.post("/LogOut", USER_BUSINESS.LogOut)
router.post("/CheckSession", USER_BUSINESS.checkSession)
router.get("/GetUser", USER_BUSINESS.getUserInfo)
router.get("/GetProvByUser", USER_BUSINESS.GetProvByUser)
router.get("/GetProjByUser", USER_BUSINESS.GetProjByUser)

module.exports = router;