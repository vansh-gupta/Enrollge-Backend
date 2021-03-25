const jwt = require("jsonwebtoken");

const authadmin = async (req, res, next) => {
    try {
        const token = req.cookies.jwtadmin;
        const VerifyAdmin = jwt.verify(token, process.env.SECRETKEY)
        console.log(VerifyAdmin); // Here We Get ObjectId Of That Admin
        next();
    } catch (e) {
        res.status(402).send(e);
    }
}


module.exports = authadmin;