var express = require('express');
var router = express.Router();
var usercontroller = require('../controller/UserController')
var User = require('../controller/User')
const passport = require('passport')
const verifyIdToken = require('../controller/verify')
/* GET users listing. */

router.post('/login', User.Login)
router.get('/get_all_user',User.getAllUser)
router.get('/get_all_employee',User.getAllEmployee)
router.get('/get_employee/:id',User.getEmployee)
router.get('/getUser/:id',User.getUser)
router.post('/change_state_user/:id',User.changeStateUser);
router.post('/change_employee/:id',User.changeEmployee);
router.post('/verifyToken',passport.authenticate('jwt',{session:false}),(req,res)=>{
    res.json({"msg":"verify success"});
})
module.exports = router;
