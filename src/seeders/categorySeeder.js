const categoryModel = require('../models/v1/categoryModel');
const { faker } = require('@faker-js/faker');
//const db = require('../src/config/db');

module.exports = {
    run: () => {
        return new Promise(async (resolve) => {
            const catObj = Array.from({ length: 10 }, () => ({
                name: faker.commerce.productName(),
                slug: '',                
                description: faker.lorem.sentence(),
            }));

            for (let ele of catObj) {
                ele.slug = ele.name.toLowerCase().replace(/\s+/g, '-');
                // const category = new categoryModel(ele);
                // await category.save();
            }

            console.log('-------------- Category data Added ------------------');
            resolve(true);
        });
    },
};
