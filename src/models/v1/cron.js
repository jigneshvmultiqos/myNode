const mongoose = require('mongoose');
const Schema = new mongoose.Schema(

    {
        name: {
            type: String,
            required: true
        },
        schedule: {
            type: String,
            required: true
        },
        status: {
            type: Number,
            default: 1,
            enum: [1, 2] //1 = active, 2 = inactive
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }
)
module.exports = mongoose.model('cron', Schema)

