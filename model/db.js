var mysql=require('mysql');
var db=mysql.createConnection({
    host: "freedb.tech",
    user: "freedbtech_khiemkhiem8499",
    password: "khiemkhiem8499",
    database: "freedbtech_hotelmanagement",
  });
  db.connect((err)=>{
    if(err){
        console.log(err);
    }
    else
    {
      console.log('Mysql Connected')
    }
})

module.exports=db;