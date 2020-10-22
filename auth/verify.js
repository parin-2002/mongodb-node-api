const jwt = require('jsonwebtoken')

function verifyEmail(req, res, next) {
    let token = req.params.token
    if (token) {
        jwt.verify(token, process.env.key, (err, decoded) => {
            if (err) {
                return res.json({
                    success: 0,
                    message: 'invalid token'
                })
            }
            else {
                req.decoded = decoded.result.email;
                next()
            }
        })
    } else {
        return res.json({
            success: 0,
            message: 'access denied! not valid user'
        })
    }
}

function verifyToken(req, res, next) {
    let token = req.get('authorization')
    if (token) {
        token = token.slice(7)
        jwt.verify(token, process.env.key, (err, decoded) => {
            if (err) {
                return res.json({
                    success: 0,
                    message: 'invalid token'
                })
            }
            else {
                req.decoded = decoded.result.email;
                next()
            }
        })
    } else {
        return res.json({
            success: 0,
            message: 'access denied! not valid user'
        })
    }
}

module.exports = { verifyEmail, verifyToken }