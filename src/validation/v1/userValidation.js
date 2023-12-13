const Joi = require("joi");
Joi.objectId = require('joi-objectid')(Joi)

module.exports = {

    async registerValidation(req, res) {
        
        // Define a Joi schema for validation
        const schema = Joi.object({
            firstName: Joi.string().trim().min(1).required(),
            lastName: Joi.string().trim().min(1).required(),
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        }).unknown(true);

        
        const {error , value } = schema.validate(req);
        if (error) {
            console.log("schema", error);
            return res.status(400).json({ error: "Failed!" });
        }
        req.validatedData = value
        return req.validatedData;
    },

    async loginValidation(req, res, next) {

        // Define a Joi schema for validation
        const schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        }).unknown(true);

        const {error} = schema.validate(req);
        if (error) {
            return res.status(400).json({ error: error.details.map(detail => detail.message) });
        }
        return null;

    }

}