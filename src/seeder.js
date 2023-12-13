const express = require("express");
require('./app');
require('./config/db');
const seeder = require('./seeders/seeder');
const promises = [];
seeder.forEach(seed => {
    // console.log(seed);
    promises.push(require(`./seeders/${seed}Seeder.js`).run());
});
Promise.all(promises)
.then( () => {
    console.log("seedar completed")
}, (err) => {
    console.log("Seedar Error" , err)
})