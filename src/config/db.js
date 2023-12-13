const mongoose = require('mongoose');
const { DB_AUTH_URL } = process.env
//console.log(DB_AUTH_URL);
mongoose.connect(DB_AUTH_URL, {

});

mongoose.connection.on("error", (e) => {
    console.log("ERROR", e);
    throw e;
})

mongoose.connection.on("connected", () => {
    console.log("Mongoose is connected")
})

module.exports = {mongoose}