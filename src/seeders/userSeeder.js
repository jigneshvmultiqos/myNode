const userModel = require('../models/v1/userModel');
const bcrypt = require('bcrypt');
const { faker } = require('@faker-js/faker');
//const db = require('../src/config/db');

module.exports = {
    run: () => {
        return new Promise(async (resolve) => {
            const catObj = Array.from({ length: 10 }, () => ({
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName(),
                password: bcrypt.hashSync(faker.internet.password(), 10),
                email: faker.internet.email(),
                otp: faker.number.int({ min: 1000, max: 9999 }).toString(),

                expirationTime: faker.date.future(),
            }));

            for (let ele of catObj) {
                // const user = new userModel(ele);
                // await user.save();
            }

            console.log('-------------- User data Added ------------------');
            resolve(true);
        });
    },
};
