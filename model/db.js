var mysql=require('mysql');
var db=mysql.createConnection({
    host: "sql12.freesqldatabase.com",
    user: "sql12386834",
    password: "Wd3CKsRfy3",
    database: "sql12386834",
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