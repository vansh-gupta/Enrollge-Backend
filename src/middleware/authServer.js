const jwt = require('jsonwebtoken');

const authServer = (req, res, next) => {
    // Get the Header Value
    const bearerHeader = req.headers['authorization'];
    // Checking If Brearer is Undefined
    if (typeof bearerHeader !== 'undefined') {
        // Split Bearer Token
        const bearer = bearerHeader.split(' ')[1]
        // Verfiy JWT Token
        jwt.verify(bearer, process.env.SECRETKEY, (err, authData) => {
            if (err) {
                res.sendStatus(403);
            } else {
                console.log(authData)
                next();
            }
        });
    } else {
        // Forbidden
        res.sendStatus(403);
    }
}

module.exports = authServer