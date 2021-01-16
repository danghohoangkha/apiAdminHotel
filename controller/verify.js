const jwt = require('jsonwebtoken');
module.exports.authenticateJWT = async function (req, res, next) {
    let authHeader = req.headers.authorization;
    if (authHeader) {
        const header = authHeader.split(" ")[1]
        jwt.verify(header, "wowwow", (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
            console.log(user)
            next();
        });
    } else {
        res.sendStatus(401);
    }
};
