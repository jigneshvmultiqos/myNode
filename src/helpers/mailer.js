const nodemailer = require("nodemailer")


module.exports.sendEmail = async (email,emailBody,subject)=>{
console.log("sendEmail")
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_SERVICE_LOCAL,
        port: 465,
        secure: true,
        auth: {
            user: process.env.SENDER_EMAIL_LOCAL,
            pass: process.env.SENDER_PASSWORD_LOCAL,
        },
    });


    let info={
        from:{
            name: process.env.SITE_NAME,
            address: process.env.SENDER_EMAIL_LOCAL,
        },
        to: email,
        subject: subject,
        html: emailBody,
        // text:emailBody
    };
    transporter.sendMail(info, async (err, info)=> {
        if (err) {
            console.log(err)
        } else {
            console.log(info.response);
        }
    });
}