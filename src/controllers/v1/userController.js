const User = require('../../models/v1/userModel');
const helper = require('../../helpers/helper')

const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const moment = require('moment');
const path = require("path");
const { JWT_AUTH_TOKEN_SECRET, JWT_EXPIRES_IN_LOCAL } = process.env


module.exports = {

    register: async (req, res) => {

        try {
            const { firstName, lastName, email, password } = req.body;

            // Find the user by email
            const user = await User.findOne({ email });
            
            if(user?.email === email) return res.status(500).json({ error: 'Email Exist' });

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);
            
            // Create a new user
            const newUser = new User({
                firstName,
                lastName,
                email,
                password: hashedPassword
            });

            // Save the user to the database
            await newUser.save();

            // Send otp
            let otp = await helper.otpFunction();
            const expirationTime = moment().add(5, "minutes").toDate();
            
            await User.updateOne({email: email}, {$set: {otp: otp, expirationTime: expirationTime}});

            //send mail
            helper.sendOtpEmail({
                "email": req.body.email,
                "firstName": firstName,
                "lastName": lastName,
                "otp": otp,
                "subject": 'Welcome to MY NODE!',
                "path": path.join(__dirname, "../../views/emails/", "otpEmail.ejs"),
            });

            return res.status(201).json({ message: 'User registered successfully' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

    },

    login: async (req, res) => {

        try {
            const { email, password } = req.body;

            // Find the user by email
            const user = await User.findOne({ email });

            // Check if the user exists
            if (!user) {
                return res.status(401).json({ error: 'Invalid email' });
            }

            
            // Compare the provided password with the stored hashed password
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Invalid password' });
            }

            if(user.isVerified === false && user.email === email){
                // Send otp
                let otp = await helper.otpFunction();
                const expirationTime = moment().add(5, "minutes").toDate();
                console.log(email, user.email, expirationTime);
                await User.updateOne({email: user.email}, {$set: {otp: otp, expirationTime: expirationTime}});

                //send mail
                helper.sendOtpEmail({
                    "email": user.email,
                    "firstName": user.firstName,
                    "lastName": user.lastName,
                    "otp": otp,
                    "subject": 'Welcome to My Node!',
                    "path": path.join(__dirname, "../../views/emails/", "otpEmail.ejs"),
                });
            }

            // Create and send a JWT token
            const token = jwt.sign({ userId: user._id }, process.env.JWT_AUTH_TOKEN_SECRET, { expiresIn: '1h' });

            res.json({ token });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    viewProfile: async (req, res) => {

        try {
            const userId = req.user.userId;
            
            
            // Find the user by ID
            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            if (req.file == undefined) {                
                return res.status(400).send({ message: "Please upload a file!" });
            
            }

            // Return the user profile
            res.json({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                status: user.status,
            });
            
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}