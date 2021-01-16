const util = require('util');
const db = require('../model/db')
const query = util.promisify(db.query).bind(db);
module.exports.revenueMonth = async function(req,res,next){
    
}