const util = require('util');
const db = require('../model/db')
const jwt = require('jsonwebtoken');
const query = util.promisify(db.query).bind(db);
const bcrypt = require('bcryptjs');
const passportJWT = require('passport-jwt');
let ExtractJwt = passportJWT.ExtractJwt;
let JwtStrategy = passportJWT.Strategy;
const passport = require('passport');

let jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = 'wowwow';

let strategy = new JwtStrategy(jwtOptions, async function (jwt_payload, next) {
    console.log('payload received', jwt_payload);
    let user = await query('Select * From users Where id = ?', [jwt_payload.id])
    if (user) {
        next(null, user);
    } else {
        next(null, false);
    }
});
passport.use(strategy);
module.exports.changeEmployee = async function(req,res,next){
    let {HoTen,GioiTinh,DiaChi,LuongCoBan,LuongTangCa,ChucVu}=req.body
    try{
        let status = await query('Update nhanvien Set HoTen = ?,GioiTinh = ?,DiaChi = ? ,LuongCoBan = ? ,LuongTangCa = ? ,ChucVu = ? Where MaNV = ?',[HoTen,GioiTinh,DiaChi,LuongCoBan,LuongTangCa,ChucVu,req.params.id])
        res.status(200).json({msg:'Oke'})
    }catch(error){
        console.log(error)
        res.status(500).json({msg:"Eror"})
    }
}
module.exports.Login = async function (req, res, next) {
    const { email, password } = req.body;
    if (email && password) {
        let user = await query(`Select * From nhanvien Where userName = '${email}'`);
        if (user.length === 0) {
            res.status(401).json({ message: 'No such user found' });
        }
        else {
            const match = await bcrypt.compareSync(password, user[0].passWord)
            if (match) {
                let payload = { id: user[0].id };
                let token = jwt.sign(payload, jwtOptions.secretOrKey);
                res.json({ msg: 'ok', user: user, token: token });
            } else {
                res.status(401).json({ msg: 'Password is incorrect' });
            }
        }
    }
}
module.exports.verifyIdToken= async function(req,res,next){
    res.json({"msg":"Ngon lanh canh dao"})
}

// module.exports.SignUp = async function (req, res, next) {
//     const { UserName, Name, Email, Password } = req.body
//     const result1 = await query('Select * From user Where UserName = ?', UserName)
//     const result2 = await query('Select * From user Where Email = ?', Email)
//     if (result1.length > 0) {
//         res.status(500).json({ msg: 'UserName đã tồn tại' })
//     }
//     else if (result2.length > 0) {
//         res.status(500).json({ msg: 'Email đã tồn tại' })
//     }
//     else {
//         const hashPassword = bcrypt.hashSync(Password, 10)
//         const result2 = await query('Insert Into user(UserName,Password,Name,Email) VALUES (?,?,?,?)', [UserName, hashPassword, Name, Email]);
//         const token = jwt.sign({ id: result2.insertId }, 'wowwow');
//         res.json({ msg: 'Đăng kí thành công', insertId: result2.insertId, token: token })
//     }
// }
module.exports.getAllEmployee = async function(req,res,next)
{
    try{
        const user = await query('Select * From nhanvien');
        res.json({user});
    }catch(error){
        console.log(error)
        res.status(500).json({msg:"error"})
    }
}
module.exports.getAllUser = async function (req,res,next){
    try{
        const user = await query('Select * From taikhoan');
        res.json({user});
    }catch(error){
        console.log(error)
        res.status(500).json({msg:"error"})
    }
}
module.exports.getEmployee = async function (req,res,next){
    try{
        const data = await query(`Select * From nhanvien Where MaNV = '${req.params.id}'`);
        res.json(data);
    }catch(error){
        console.log(error)
        res.status(500).json({msg:"error"})
    }
}
module.exports.AddEmployee = async function (req,res,next){
    try{
        const status = await query(`Insert Into phong (HoTen,GioiTinh,NgaySinh,DiaChi,LuongCoBan,LuongTangCa,ChucVu) VALUES ('${req.body.HoTen,req.body.GioiTinh,req.body.NgaySinh,req.body.DiaChi,req.LuongCoBan,req.LuongTangCa,req.ChucVu}')`)
        res.status(200).json({msg:"Them nhan vien thanh cong"})
    }catch(error)
    {
        console.log(error)
        res.status(500).json({msg:"error"})
    }
}
module.exports.getEmployee = async function(req,res,next){
    try{
        const data = await query(`Select * From nhanvien Where MaNV = '${req.params.id}'`)
        res.status(200).json(data)
    }catch(error)
    {
        console.log(error)
        res.status(500).json({msg:'error'})
    }
}
module.exports.changeStateUser = async function(req,res,next){
    try{
        const status = await query(`Update taikhoan Set TrangThai = ${req.body.active===true?1:0} Where MaTK = ${req.params.id}`)
        res.json(status);
    }catch(error){
        console.log(error)
        res.status(500).json({msg:"error"})
    }
}
module.exports.getUser = async function(req,res,next){
    try{
        const data = await query(`Select * From taikhoan Where MaTK = '${req.params.id}'`)
        res.json(data);
    }catch(error){
        console.log(error);
        res.status(500).json({msg:"error"});
    }
}
