const jwt = require('jsonwebtoken');
const config = require('./config');

module.exports = (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers['x-access-token']

    // decode token 
    if (token) {
        jwt.verify(token, config.secret, (err, decode) => {
            if (err) {
                return res.status(401).json({
                    error: true,
                    message: 'Unauthorized access' 
                });
            }
        })
        req.decode = decode;
        next();
    }else {
        // if there is no token
        // return an error
        return res.status(403).json({
            error: true,
            message: 'No token provided.'
        })
    }
}