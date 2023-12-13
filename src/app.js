const express = require('express');
//const path = require("path");
const cors = require("cors");
// const axios = require('axios');
// const http = require('http');
// const https = require('https');
const bodyParser = require('body-parser');
const app = express();
require("dotenv").config()


const db = require('../src/config/db');

//cors
app.use(cors({ origin: '*' }));

//Middleware setup
//app.use(express.json());
app.use(bodyParser.json());

// Parse form-data
app.use(bodyParser.urlencoded({ extended: false }));




const port = process.env.API_PORT;

app.get('/', (req, res) => {
    res.status(200).send("My Node route")
})
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

const requestLoggerMiddleware = (req, res, next) => {
    console.log(`[Request Log] ${req.method} ${req.url}`);
    next();
};


// Apply the requestLoggerMiddleware to all routes
app.use(requestLoggerMiddleware);

app.use(require("./routes/commonRoute"));