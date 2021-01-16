const express = require('express');
const router = express.Router();
const roomController =require('../controller/roomController')
const chessController = require('../controller/chessController')

/* GET home page. */
router.get('/',function(req, res, next){
  res.json("Kha dep trai is here")
});
router.get('/getAllMatch',chessController.getAllMatch)
router.get('/getAllMatchOfUser/:id',chessController.getAllMatchOfUser);
router.get('/getChatUser/:id',chessController.getChatOfMatch)
router.get('/getAllRoom',roomController.getAllRoom)
router.post('/addRoom',roomController.addRoom)
router.get('/getRoom/:id',roomController.getRoom)
router.post('/updateRoom/:id',roomController.updateRoom)
router.post('/deleteRoom/:id',roomController.deleteRoom)
router.get('/phieudatphong',roomController.phieudatphong)
module.exports = router;
