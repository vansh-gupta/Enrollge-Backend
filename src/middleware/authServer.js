const jwt = require('jsonwebtoken');

const authServer = (req, res, next) => {
    // Get the Header Value
    const bearerHeader = req.headers['authorization'];
    // Checking If Brearer is Undefined
    if (typeof bearerHeader !== 'undefined') {
        // Split Bearer Token
        const bearer = bearerHeader.split(' ')[1]
        // Verify API Token
        if (bearer == process.env.API_TOKEN) {
            next();
        } else {
            res.status(403).send("Authentication Error");
        }
    } else {
        // Forbidden
        res.sendStatus(403);
    }
}

module.exports = authServer