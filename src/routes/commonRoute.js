const app = require("express")();

//V1
const user = require("./v1/userRoute");
app.use("/api/v1/user", user);


//V1
const blog = require("./v1/blogRoute");
app.use("/api/v1/blog", blog);



const category = require("./v1/categoryRoute");
app.use("/api/v1/category", category);


module.exports = app;