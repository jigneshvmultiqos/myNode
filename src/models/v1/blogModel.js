const mongoose = require('mongoose');

const schema = new mongoose.Schema(
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
        categoryId:{
            type: mongoose.Schema.Types.ObjectId,
			ref : "category",
			index: true
        },
        userID:{
            type: mongoose.Schema.Types.ObjectId,
            ref : "user",
            index: true
        },
        status: {
            type: Number,
            default: 1,
            enum: [1, 2, 3],    //1=Active 2=InActive 3=Deleted
            index: true
        }
        
    },
    { collection: "blog", timestamps: true }
)

module.exports = mongoose.model("blog", schema)
