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
module.exports.Login = async function (req, res, next) {
    const { email, password } = req.body;
    if (email && password) {
        let user = await query('Select * From users us, user_roles ur Where us.email = ? And ur.userId = us.id And ur.roleId = ?', [email, 2]);
        if (user.length === 0) {
            res.status(401).json({ message: 'No such user found' });
        }
        else {
            const match = await bcrypt.compareSync(password, user[0].password)
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

module.exports.SignUp = async function (req, res, next) {
    const { UserName, Name, Email, Password } = req.body
    const result1 = await query('Select * From user Where UserName = ?', UserName)
    const result2 = await query('Select * From user Where Email = ?', Email)
    if (result1.length > 0) {
        res.status(500).json({ msg: 'UserName đã tồn tại' })
    }
    else if (result2.length > 0) {
        res.status(500).json({ msg: 'Email đã tồn tại' })
    }
    else {
        const hashPassword = bcrypt.hashSync(Password, 10)
        const result2 = await query('Insert Into user(UserName,Password,Name,Email) VALUES (?,?,?,?)', [UserName, hashPassword, Name, Email]);
        const token = jwt.sign({ id: result2.insertId }, 'wowwow');
        res.json({ msg: 'Đăng kí thành công', insertId: result2.insertId, token: token })
    }
}
module.exports.GoogleLogin = async function (req, res, next) {
    const tokenId = req.body.data.tokenId;
    console.log("Kha dep trai")
    client.verifyIdToken({ idToken: tokenId, audience: "320573277197-1rt2dc288vbuui0ealbnjq4qf4pcjopq.apps.googleusercontent.com" }).then(async response => {
        const { email_verified, name, email, user } = response.payload;
        if (email_verified) {
            const result1 = await query('SELECT * FROM user WHERE email = ?', [email])
            if (result1.length > 0) {
                const token = jwt.sign({ id: result1[0].id }, 'wowwow')
                res.json({
                    msg: 'ok',
                    user: { id: result1[0].id, Name: name, Email: email },
                    token: token
                })
            }
            else {
                const result2 = await query('Insert INTO user(Name,Email) VALUES (?,?)', [name, email])
                console.log('Kha dep trai')
                const token = jwt.sign({ id: result2.insertId }, 'wowwow')
                res.json({
                    msg: 'ok',
                    user: { id: result2.insertId, Name: name, Email: email },
                    token: token
                })
            }
        }
        console.log(response.payload)
    })

}

module.exports.FacebookLogin = async function (req, res, next) {
    const { accessToken, userID } = req.body.data;
    let UrlGraphicFacebook = `https://graph.facebook.com/v2.11/${userID}/?fields=id,name,email&access_token=${accessToken}`
    fetch(UrlGraphicFacebook, {
        method: 'GET'
    })
        .then(res => res.json())
        .then(async response => {
            console.log(response);
            const { email, name } = response;
            if (email === undefined)
                email = '';
            const result1 = await query('SELECT * FROM user WHERE email = ?', [email])
            if (result1.length > 0) {
                const token = jwt.sign({ id: result1[0].id }, 'wowwow')
                res.json({
                    msg: 'ok',
                    user: { id: result1[0].id, Name: name, Email: email },
                    token: token
                })
            }
            else {
                const result2 = await query('Insert INTO user(Name,Email) VALUES (?,?)', [name, email])
                console.log('Kha dep trai')
                const token = jwt.sign({ id: result2.insertId }, 'wowwow')
                res.json({
                    msg: 'ok',
                    user: { id: result2.insertId, Name: name, Email: email },
                    token: token
                })
            }
        })
}
module.exports.getAllUser = async function (req,res,next){
    try{
        const data = await query('Select * From users As u , user_roles As ur Where u.id = ur.userId');
        res.json(data);
    }catch(error){
        console.log(error)
        res.status(500).json({msg:"error"})
    }
}
module.exports.changeStateUser = async function(req,res,next){
    try{
        const status = await query(`Update users Set state = ${req.body.active===true?1:0} Where id = ${req.params.id}`)
        res.json(status);
    }catch(error){
        console.log(error)
        res.status(500).json({msg:"error"})
    }
}
module.exports.getUser = async function(req,res,next){
    try{
        const data = await query(`Select * From users as u,user_roles as us Where u.id = ${req.params.id} And u.id=us.userId`)
        res.json(data);
    }catch(error){
        console.log(error);
        res.status(500).json({msg:"error"});
    }
}