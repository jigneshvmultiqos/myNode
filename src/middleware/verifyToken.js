const jwt = require('jsonwebtoken');
const User = require('../models/v1/userModel');
require("dotenv").config()

module.exports = {

    async authenticateToken(req, res, next) {

        //if (!req.header("Authorization")) return res.status(401).json({ error: 'Authorization is required.' });

        const token = req.header('Authorization').replace('Bearer ', '');
        console.log("Token =======->", token);
        if (!token) {
            return res.status(401).json({ error: 'Access denied. Token is required.' });
        }

        try {
            let decode = await jwt.verify(token, process.env.JWT_AUTH_TOKEN_SECRET);
            console.log("decode Token =======->", decode);

            if (!decode) return res.status(401).json({ error: 'tokenExpired.' });
            const user = await User.findById({_id: decode.userId});
            console.log("decode userId =======->", decode.userId);
            if (!user) return res.status(401).json({ error: 'userNotFound.' });
            req.user = user;
            await next();

            // jwt.verify(token, process.env.JWT_AUTH_TOKEN_SECRET, (err, user) => {
            //     if (err) {
            //         return res.status(403).json({ error: 'Invalid token.' });
            //     }

            //     req.user = user;
            //     next();
            // });
        } catch (error) {
            res.status(401).json({ message: 'Invalid token' });
        }        

    }
}