const ejs = require("ejs");
const Mailer = require("./mailer")
const bcrypt = require("bcrypt");
require("dotenv").config()
const path = require("path")
const fs = require("fs")


module.exports = {
    
    sendOtpEmail: async (req) => {
        let locals = {
            username: req.firstName + " " + req.lastName,
            appname: "MY NODE",
            token: req.otp,
            email: req.email ? req.email : "",
            siteName : process.env.SITE_NAME
        };
        const emailBody = await ejs.renderFile(req.path, {locals: locals});
        //sending mail to user
        Mailer.sendEmail(req.email, emailBody, req.subject);
    },

    
    otpFunction : async () => {
        let otp = Math.floor(Math.random() * 9000) + 1000;
        otp = parseInt(otp);
        return otp;
    },
    
}
