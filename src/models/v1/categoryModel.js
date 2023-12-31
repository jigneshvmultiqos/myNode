const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
    {
        name:{
            type: String,
            index: true
        },
        slug:{
            type: String,
            index: true,
            unique: true    
        },
        description:{
            type: String,
            index: true
        },
        status: {
            type: Number,
            default: 1,
            enum: [1, 2, 3],    //1=Active 2=InActive 3=Deleted
            index: true
        }
        
    },
    { collection: "category", timestamps: true }
)

module.exports = mongoose.model("category", categorySchema)
