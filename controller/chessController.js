const util = require('util');
const db = require('../model/db')
const query = util.promisify(db.query).bind(db);
module.exports.getAllMatch=async function(req,res,next)
{
    try{        
        const data = await query('Select * From matchofchess');
        res.json(data);
    }catch(error){
        console.log(error)
        res.status(500).json({msg : 'error'})
    }
}
module.exports.getAllMatchOfUser = async function(req,res,next)
{
    try{
        const data = await query(`Select * From matchofchess As moc Where (moc.player1 = ${req.params.id} Or moc.player2= ${req.params.id})`)
        res.json(data)
    }catch(error)
    {
        console.log(error)
        res.status(500).json({msg:'error'});   
    }
}
module.exports.getChatOfMatch = async function(req,res,next){
    try{
        const data = await query(`Select * From chat_match Where matchId = ?`,[req.params.id])
        res.json(data)
    }catch(error){
        console.log(error)
        res.status(500).json({msg:"error"});
    }
}

