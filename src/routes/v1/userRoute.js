const express = require("express");
const router = express.Router();
const Joi = require('joi');
const userController = require("../../controllers/v1/userController");
const jwt = require("jsonwebtoken");
const userModel = require('../../models/v1/userModel')
router.get("/", (req, res) => {
    res.status(200).json("Testing User route");
})


const verifyToken = require('../../middleware/verifyToken')

const {validMulterUploadMiddleware,uploadImage} = require("../../middleware/uploadImage")

// Validation Middleware using Joi
const registerInput = (req, res, next) => {
    // Define a Joi schema for validation
    const schema = Joi.object({
        firstName: Joi.string().trim().min(1).required(),
        lastName: Joi.string().trim().min(1).required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    }).unknown(true);

    // Validate req.query against the schema
    const { error, value } = schema.validate(req.body);

    // If there's an error, send a 400 Bad Request response
    if (error) {
        return res.status(400).json({ error: error.details.map(detail => detail.message) });
    }

    // Attach the validated data to the request object for later use in the route
    req.validatedData = value;

    // Move to the next middleware or route handler
    next();
};

const loginInput = (req, res, next) => {
    // Define a Joi schema for validation
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    }).unknown(true);

    // Validate req.query against the schema
    const { error, value } = schema.validate(req.body);

    // If there's an error, send a 400 Bad Request response
    if (error) {
        return res.status(400).json({ error: error.details.map(detail => detail.message) });
    }

    // Attach the validated data to the request object for later use in the route
    req.validatedData = value;

    // Move to the next middleware or route handler
    next();
};

// Middleware to verify the token
const authenticateToken = (req, res, next) => {

    const token = req.header('Authorization').replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ error: 'Access denied. Token is required.' });
    }
    
    jwt.verify(token, process.env.JWT_AUTH_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token.' });
        }

        req.user = user;
        next();
    });
};


router.post("/register", registerInput, userController.register);
router.post("/login", loginInput, userController.login);
router.post("/viewProfile", authenticateToken, validMulterUploadMiddleware (uploadImage.single("profilePicture")), userController.viewProfile);




module.exports = router;